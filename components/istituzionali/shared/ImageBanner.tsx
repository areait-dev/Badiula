'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import styles from './ImageBanner.module.css';

interface ImageBannerProps {
  src: string;
  alt: string;
  position?: string;
  pullUp?: number;
  video?: string;
}

export default function ImageBanner({ src, alt, position = 'center', pullUp, video }: ImageBannerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;
    el.muted = true;
    el.play().catch(() => {});
  }, []);

  return (
    <div className={styles.banner} style={pullUp ? { marginTop: -pullUp } : undefined}>
      {video ? (
        <video
          ref={videoRef}
          className={styles.video}
          src={video}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          style={{ objectFit: 'cover', objectPosition: position }}
        />
      ) : (
        <Image
          src={src}
          alt={alt}
          fill
          sizes="100vw"
          style={{ objectFit: 'cover', objectPosition: position }}
        />
      )}
    </div>
  );
}
