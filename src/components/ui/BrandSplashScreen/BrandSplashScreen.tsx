import React from "react";
import Image from "next/image";
import styles from "./BrandSplashScreen.module.css";

export const BrandSplashScreen = () => {
  return (
    <div className={styles.container}>
      {/* Subtle ambient orange/gold glow behind the logo */}
      <div className={styles.glow}></div>
      
      <div className={styles.content}>
        {/* Logo container with dual spinning orbital rings */}
        <div className={styles.logoContainer}>
          <div className={styles.ringOuter}></div>
          <div className={styles.ringInner}></div>
          
          <Image 
            src="/images/logo.webp"
            alt="JEE Archive" 
            width={40}
            height={40}
            className={styles.logo}
            priority
          />
        </div>
        
        {/* Sleek Typography */}
        <h1 className={styles.title}>
          JEE Archive
        </h1>
      </div>
    </div>
  );
};