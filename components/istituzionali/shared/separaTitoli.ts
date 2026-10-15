/**
 * Garantisce che i mini-titoli indicati stiano su un paragrafo proprio, in grassetto,
 * anche quando WordPress li consegna nel flusso del testo.
 */
export function separaTitoli(html: string, titoli: string[]): string {
  let out = /<p[\s>]/i.test(html) ? html : `<p>${html}</p>`;
  for (const t of titoli) {
    out = out.replace(
      new RegExp(String.raw`(?:<p[^>]*>\s*)?(?:<(?:strong|b)[^>]*>\s*)?${t}\s*(?:</(?:strong|b)>\s*)?(?:<br\s*/?>\s*)?(?:</p>\s*)?`, 'i'),
      `</p><p><strong>${t}</strong></p><p>`,
    );
  }
  return out.replace(/<p[^>]*>\s*<\/p>\s*/gi, '');
}

/** Mette in grassetto (bordeaux via `.body strong`) i termini indicati, se non lo sono già. */
export function evidenzia(html: string, termini: string[]): string {
  return termini.reduce(
    (out, t) =>
      out.replace(
        new RegExp(String.raw`(<(?:strong|b)[^>]*>\s*)?${t}(\s*</(?:strong|b)>)?`, 'i'),
        (m, open, close) => (open && close ? m : `<strong>${t}</strong>`),
      ),
    html,
  );
}
