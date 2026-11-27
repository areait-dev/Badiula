import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { clientIp, EMAIL_RE, field, isRateLimited } from '@/lib/formGuard';

export async function POST(req: NextRequest) {
  if (isRateLimited(`contact:${clientIp(req.headers)}`, 5, 10 * 60 * 1000)) {
    return NextResponse.json({ error: 'rate_limited' }, { status: 429 });
  }

  const body = await req.json().catch(() => null);
  if (!body || typeof body !== 'object') {
    return NextResponse.json({ error: 'invalid' }, { status: 400 });
  }

  // Honeypot: il campo è invisibile alle persone, lo compilano solo i bot.
  // Si risponde "ok" per non segnalare al bot che è stato scartato.
  if (field(body.website)) {
    return NextResponse.json({ ok: true });
  }

  const name = field(body.name).replace(/\s+/g, ' ');
  const email = field(body.email);
  const phone = field(body.phone);
  const message = field(body.message);

  if (
    !name || name.length > 100 ||
    !EMAIL_RE.test(email) || email.length > 200 ||
    phone.length > 40 ||
    !message || message.length > 5000 ||
    body.privacy !== true
  ) {
    return NextResponse.json({ error: 'invalid' }, { status: 400 });
  }

  const { RESEND_API_KEY, CONTACT_TO_EMAIL, CONTACT_FROM_EMAIL } = process.env;
  if (!RESEND_API_KEY || !CONTACT_TO_EMAIL || !CONTACT_FROM_EMAIL) {
    console.error('[contact] Mancano RESEND_API_KEY, CONTACT_TO_EMAIL o CONTACT_FROM_EMAIL');
    return NextResponse.json({ error: 'send_failed' }, { status: 500 });
  }

  // Solo testo semplice: nessun HTML costruito con i dati dell'utente.
  const { error } = await new Resend(RESEND_API_KEY).emails.send({
    from: CONTACT_FROM_EMAIL,
    to: CONTACT_TO_EMAIL.split(',').map((address) => address.trim()),
    replyTo: email,
    subject: `Nuovo messaggio dal sito: ${name}`,
    text: [
      `Nome: ${name}`,
      `Email: ${email}`,
      `Telefono: ${phone || '-'}`,
      '',
      'Messaggio:',
      message,
    ].join('\n'),
  });

  if (error) {
    console.error('[contact] Resend:', error);
    return NextResponse.json({ error: 'send_failed' }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
