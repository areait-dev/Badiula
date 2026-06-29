'use client';

import styles from './AziendaHeroVideo.module.css';

export default function AziendaHeroVideo() {
  return (
    <div className={styles.videoWrap}>
      <video
        src="/videos/dji_0003_web.mp4"
        autoPlay
        muted
        loop
        playsInline
        className={styles.video}
      />
    </div>
  );
}
