import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { clientIp, field, isRateLimited } from '@/lib/formGuard';
import { readToken } from '@/lib/newsletterToken';

/**
 * Secondo passo del double opt-in: salva il contatto su Resend.
 * È una POST (non il semplice clic sul link) perché i filtri antispam aprono
 * i link delle email e confermerebbero l'iscrizione da soli.
 */
export async function POST(req: NextRequest) {
  if (isRateLimited(`confirm:${clientIp(req.headers)}`, 10, 10 * 60 * 1000)) {
    return NextResponse.json({ error: 'rate_limited' }, { status: 429 });
  }

  const body = await req.json().catch(() => null);
  const { NEWSLETTER_SECRET, RESEND_SEGMENT_ID } = process.env;
  // La gestione dei contatti richiede una chiave "Full access".
  const apiKey = process.env.RESEND_CONTACTS_API_KEY || process.env.RESEND_API_KEY;

  if (!NEWSLETTER_SECRET || !apiKey) {
    console.error('[newsletter] Mancano NEWSLETTER_SECRET o la chiave Resend');
    return NextResponse.json({ error: 'save_failed' }, { status: 500 });
  }

  const email = readToken(field(body?.token), NEWSLETTER_SECRET);
  if (!email) {
    return NextResponse.json({ error: 'invalid' }, { status: 400 });
  }

  const resend = new Resend(apiKey);
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

  return NextResponse.json({ ok: true });
}
