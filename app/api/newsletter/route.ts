import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { clientIp, EMAIL_RE, field, isRateLimited } from '@/lib/formGuard';
import { createToken } from '@/lib/newsletterToken';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://agribadiula.it';
const HOUR = 60 * 60 * 1000;

const COPY = {
  it: {
    subject: 'Conferma la tua iscrizione alla newsletter Badiula',
    intro: 'Per confermare l’iscrizione alla newsletter Badiula apri questo link:',
    outro: 'Il link vale 48 ore. Se non hai richiesto tu l’iscrizione, ignora questa email.',
  },
  en: {
    subject: 'Confirm your Badiula newsletter subscription',
    intro: 'To confirm your subscription to the Badiula newsletter, open this link:',
    outro: 'The link is valid for 48 hours. If you did not ask to subscribe, ignore this email.',
  },
};

/** Primo passo del double opt-in: invia l'email con il link di conferma. */
export async function POST(req: NextRequest) {
  if (isRateLimited(`newsletter:${clientIp(req.headers)}`, 5, HOUR)) {
    return NextResponse.json({ error: 'rate_limited' }, { status: 429 });
  }

  const body = await req.json().catch(() => null);
  if (!body || typeof body !== 'object') {
    return NextResponse.json({ error: 'invalid' }, { status: 400 });
  }

  // Honeypot: vedi app/api/contact/route.ts
  if (field(body.website)) {
    return NextResponse.json({ ok: true });
  }

  const email = field(body.email).toLowerCase();
  if (!EMAIL_RE.test(email) || email.length > 200 || body.privacy !== true) {
    return NextResponse.json({ error: 'invalid' }, { status: 400 });
  }

  const { RESEND_API_KEY, CONTACT_FROM_EMAIL, NEWSLETTER_SECRET } = process.env;
  if (!RESEND_API_KEY || !CONTACT_FROM_EMAIL || !NEWSLETTER_SECRET) {
    console.error('[newsletter] Mancano RESEND_API_KEY, CONTACT_FROM_EMAIL o NEWSLETTER_SECRET');
    return NextResponse.json({ error: 'send_failed' }, { status: 500 });
  }

  // Evita che il form venga usato per riempire di email la casella di qualcuno.
  if (isRateLimited(`newsletter-to:${email}`, 2, HOUR)) {
    return NextResponse.json({ error: 'rate_limited' }, { status: 429 });
  }

  const locale = body.locale === 'en' ? 'en' : 'it';
  // In produzione l'indirizzo viene dalla configurazione, non dalla richiesta.
  const origin = process.env.NODE_ENV === 'production' ? SITE_URL : req.nextUrl.origin;
  const link = `${origin}/${locale}/newsletter/conferma?token=${createToken(email, NEWSLETTER_SECRET)}`;
  const copy = COPY[locale];

  const { error } = await new Resend(RESEND_API_KEY).emails.send({
    from: CONTACT_FROM_EMAIL,
    to: email,
    subject: copy.subject,
    text: `${copy.intro}\n\n${link}\n\n${copy.outro}`,
  });

  if (error) {
    console.error('[newsletter] Resend:', error);
    return NextResponse.json({ error: 'send_failed' }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
