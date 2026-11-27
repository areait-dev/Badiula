import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { clientIp, EMAIL_RE, field, isRateLimited } from '@/lib/formGuard';
import { createToken } from '@/lib/newsletterToken';

// Con "www": senza, il dominio risponde con un redirect che i programmi di
// posta non seguono nella disiscrizione con un clic.
const SITE_URL = 'https://www.agribadiula.it';
const HOUR = 60 * 60 * 1000;

const COPY = {
  it: {
    subject: 'Grazie per l’iscrizione alla newsletter Badiula',
    text: 'Grazie per esserti iscritto alla newsletter Badiula.\n\nSe non hai richiesto tu l’iscrizione, o non vuoi più ricevere la newsletter, puoi disiscriverti da qui:',
  },
  en: {
    subject: 'Thank you for subscribing to the Badiula newsletter',
    text: 'Thank you for subscribing to the Badiula newsletter.\n\nIf you did not ask to subscribe, or no longer want to receive the newsletter, you can unsubscribe here:',
  },
};

/** Salva l'iscritto nei contatti Resend e gli invia l'email di ringraziamento. */
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

  const { RESEND_API_KEY, RESEND_SEGMENT_ID, CONTACT_FROM_EMAIL, CONTACT_TO_EMAIL, NEWSLETTER_SECRET } =
    process.env;
  // La gestione dei contatti richiede una chiave "Full access".
  if (!RESEND_API_KEY || !CONTACT_FROM_EMAIL || !NEWSLETTER_SECRET) {
    console.error('[newsletter] Mancano RESEND_API_KEY, CONTACT_FROM_EMAIL o NEWSLETTER_SECRET');
    return NextResponse.json({ error: 'save_failed' }, { status: 500 });
  }

  // Evita che il form venga usato per riempire di email la casella di qualcuno.
  if (isRateLimited(`newsletter-to:${email}`, 2, HOUR)) {
    return NextResponse.json({ error: 'rate_limited' }, { status: 429 });
  }

  const resend = new Resend(RESEND_API_KEY);
  const created = await resend.contacts.create({
    email,
    unsubscribed: false,
    ...(RESEND_SEGMENT_ID && { segments: [{ id: RESEND_SEGMENT_ID }] }),
  });

  if (created.error) {
    // Il contatto può esistere già (es. si era disiscritto): lo si riattiva.
    const updated = await resend.contacts.update({ email, unsubscribed: false });
    const added =
      !updated.error && RESEND_SEGMENT_ID
        ? await resend.contacts.segments.add({ email, segmentId: RESEND_SEGMENT_ID })
        : null;

    if (updated.error || added?.error) {
      console.error('[newsletter] Resend:', created.error, updated.error ?? added?.error);
      return NextResponse.json({ error: 'save_failed' }, { status: 502 });
    }
  }

  const locale = body.locale === 'en' ? 'en' : 'it';
  const copy = COPY[locale];
  // In produzione l'indirizzo è fisso, non dipende dalla richiesta.
  const origin = process.env.NODE_ENV === 'production' ? SITE_URL : req.nextUrl.origin;
  const token = createToken(email, NEWSLETTER_SECRET);
  const { error } = await resend.emails.send({
    from: CONTACT_FROM_EMAIL,
    to: email,
    // Le risposte arrivano a una casella letta.
    replyTo: CONTACT_TO_EMAIL?.split(',').map((address) => address.trim()),
    subject: copy.subject,
    text: `${copy.text}\n${origin}/${locale}/newsletter/disiscrizione?token=${token}`,
    // Pulsante "Annulla iscrizione" di Gmail, Outlook, ecc.
    headers: {
      'List-Unsubscribe': `<${origin}/api/newsletter/unsubscribe?token=${token}>`,
      'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click',
    },
  });

  // L'iscrizione è già salvata: un errore sull'email di cortesia non la annulla.
  if (error) console.error('[newsletter] Email di ringraziamento:', error);

  return NextResponse.json({ ok: true });
}
