// Token del link di conferma newsletter. Solo server.
//
// L'iscrizione in sospeso non viene salvata da nessuna parte: email e scadenza
// viaggiano nel link, cifrate (AES-256-GCM). Così l'indirizzo non è leggibile
// nell'URL (log, analytics) e il token non può essere falsificato.
import { createCipheriv, createDecipheriv, createHash, randomBytes } from 'node:crypto';

const VALIDITY_MS = 48 * 60 * 60 * 1000;

const keyFrom = (secret: string) => createHash('sha256').update(secret).digest();

export function createToken(email: string, secret: string): string {
  const iv = randomBytes(12);
  const cipher = createCipheriv('aes-256-gcm', keyFrom(secret), iv);
  const payload = JSON.stringify({ email, expires: Date.now() + VALIDITY_MS });
  const encrypted = Buffer.concat([cipher.update(payload, 'utf8'), cipher.final()]);
  return Buffer.concat([iv, cipher.getAuthTag(), encrypted]).toString('base64url');
}

/** L'email contenuta nel token, oppure null se è alterato o scaduto. */
export function readToken(token: string, secret: string): string | null {
  try {
    const raw = Buffer.from(token, 'base64url');
    const decipher = createDecipheriv('aes-256-gcm', keyFrom(secret), raw.subarray(0, 12), {
      authTagLength: 16,
    });
    decipher.setAuthTag(raw.subarray(12, 28));
    const payload = Buffer.concat([decipher.update(raw.subarray(28)), decipher.final()]);
    const { email, expires } = JSON.parse(payload.toString('utf8'));
    return typeof email === 'string' && Date.now() < expires ? email : null;
  } catch {
    return null;
  }
}
