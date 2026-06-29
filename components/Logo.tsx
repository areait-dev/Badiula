import Image from 'next/image';

interface LogoProps {
  size?: number;
  showText?: boolean;
  /** Render the (monochrome) logo in white, for dark backgrounds. */
  light?: boolean;
}

export default function Logo({ size = 40, showText = true, light = false }: LogoProps) {
  // The logo artwork already contains the "BADIULA" wordmark, so when the
  // text is requested we give it more height to fit the full lockup.
  const height = showText ? Math.round(size * 1.9) : size;
  const width = Math.round(height * (1920 / 1080));

  return (
    <Image
      src="/images/logo-badiula.png"
      alt="Badiula"
      width={width}
      height={height}
      priority
      style={{
        height,
        width: 'auto',
        objectFit: 'contain',
        filter: light ? 'brightness(0) invert(1)' : undefined,
      }}
    />
  );
}
