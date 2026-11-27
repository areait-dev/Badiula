import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { clientIp, field, isRateLimited } from '@/lib/formGuard';
import { readToken } from '@/lib/newsletterToken';

/**
 * Disiscrive il contatto su Resend. La chiamano la pagina di disiscrizione e,
 * con un solo clic, i programmi di posta (header List-Unsubscribe).
 * Solo POST: i filtri antispam aprono i link e disiscriverebbero da soli.
 */
export async function POST(req: NextRequest) {
  if (isRateLimited(`unsubscribe:${clientIp(req.headers)}`, 30, 10 * 60 * 1000)) {
    return NextResponse.json({ error: 'rate_limited' }, { status: 429 });
  }

  const { RESEND_API_KEY, NEWSLETTER_SECRET } = process.env;
  if (!RESEND_API_KEY || !NEWSLETTER_SECRET) {
    console.error('[newsletter] Mancano RESEND_API_KEY o NEWSLETTER_SECRET');
    return NextResponse.json({ error: 'save_failed' }, { status: 500 });
  }

  const email = readToken(field(req.nextUrl.searchParams.get('token')), NEWSLETTER_SECRET);
  if (!email) {
    return NextResponse.json({ error: 'invalid' }, { status: 400 });
  }

  const { error } = await new Resend(RESEND_API_KEY).contacts.update({ email, unsubscribed: true });

  // Un contatto che non esiste più è già disiscritto.
  if (error && error.name !== 'not_found') {
    console.error('[newsletter] Disiscrizione:', error);
    return NextResponse.json({ error: 'save_failed' }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
