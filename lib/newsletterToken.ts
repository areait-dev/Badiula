// Token del link di disiscrizione dalla newsletter. Solo server.
//
// L'email viaggia nel link cifrata (AES-256-GCM): non è leggibile nell'URL
// (log, analytics) e nessuno può disiscrivere un indirizzo altrui inventando
// un link. Non ha scadenza: deve funzionare anche da un'email vecchia.
import { createCipheriv, createDecipheriv, createHash, randomBytes } from 'node:crypto';

const keyFrom = (secret: string) => createHash('sha256').update(secret).digest();

export function createToken(email: string, secret: string): string {
  const iv = randomBytes(12);
  const cipher = createCipheriv('aes-256-gcm', keyFrom(secret), iv);
  const encrypted = Buffer.concat([cipher.update(email, 'utf8'), cipher.final()]);
  return Buffer.concat([iv, cipher.getAuthTag(), encrypted]).toString('base64url');
}

/** L'email contenuta nel token, oppure null se è alterato. */
export function readToken(token: string, secret: string): string | null {
  try {
    const raw = Buffer.from(token, 'base64url');
    const decipher = createDecipheriv('aes-256-gcm', keyFrom(secret), raw.subarray(0, 12), {
      authTagLength: 16,
    });
    decipher.setAuthTag(raw.subarray(12, 28));
    const email = Buffer.concat([decipher.update(raw.subarray(28)), decipher.final()]);
    return email.toString('utf8') || null;
  } catch {
    return null;
  }
}
