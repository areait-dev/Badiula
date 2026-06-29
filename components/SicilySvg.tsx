export default function SicilySvg({ size = 280 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size * 0.62}
      viewBox="0 0 320 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Silhouette della Sicilia"
    >
      {/* Stylised triangular Sicily silhouette */}
      <path
        d="M18 70 L70 40 L150 28 L230 48 L300 120 L250 150 L180 160 L120 175 L60 150 L30 110 Z"
        fill="var(--bordeaux)"
      />
      {/* Carlentini / Siracusa marker (east coast) */}
      <circle cx="270" cy="130" r="9" fill="var(--khaki)" />
      <circle cx="270" cy="130" r="9" fill="none" stroke="var(--vanilla)" strokeWidth="2" />
    </svg>
  );
}
