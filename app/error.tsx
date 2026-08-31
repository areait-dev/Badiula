'use client';

// Global error boundary: sostituisce l'intero root layout (html/body), quindi
// non ha accesso a globals.css né ai design token CSS custom properties.
// Colori hardcoded qui sono un'eccezione deliberata e isolata a questo
// fallback di ultima istanza (crash irrecuperabile) — non un precedente
// per il resto del codebase, dove restano vietati (CLAUDE.md §13).
export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="it">
      <body style={{ fontFamily: 'sans-serif' }}>
        <div
          style={{
            minHeight: '60vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            gap: '16px',
            padding: '80px 24px',
          }}
        >
          <h1 style={{ color: '#6C1224' }}>Qualcosa è andato storto</h1>
          <p>Si è verificato un errore imprevisto. Riprova tra poco.</p>
          <button
            onClick={() => reset()}
            style={{
              borderRadius: '999px',
              border: '1px solid #6C1224',
              color: '#6C1224',
              background: 'transparent',
              padding: '12px 24px',
              cursor: 'pointer',
            }}
          >
            Riprova
          </button>
        </div>
      </body>
    </html>
  );
}
