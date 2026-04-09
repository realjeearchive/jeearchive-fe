import Link from 'next/link';
import Image from 'next/image';
import Styles from './not-found.module.css';

// Adjust this import path depending on where your assets folder is!
// If it is in the public folder, remove this import.
import logo from '@/assets/image/jeearchive.png'; 

export default function NotFound() {
  return (
    <div className={Styles.container}>
      
      {/* Giant subtle background 404 text */}
      <div className={Styles.bgText}>404</div>
      
      {/* Main Content */}
      <div className={Styles.content}>
        
        {/* Your Brand Logo replaces the old icon box */}
        <div className={Styles.logoWrapper}>
          <Image 
            src={logo} // If using the public folder, change this to: src="/assets/jeearchive.png"
            alt="JEE Archive Logo" 
            width={80} 
            height={80} 
            className={Styles.logoImage}
            priority // Tells Next.js to load this instantly since it's above the fold
          />
        </div>

        <h2 className={Styles.title}>
          Oops! Page Not Found
        </h2>
        
        <p className={Styles.subtitle}>
          It looks like you have wandered into an unknown dimension. The page you are looking for does not exist or has been moved.
        </p>

        {/* Brand-matching button back to safety */}
        <Link href="/dashboard" className={Styles.button}>
          Go back to Dashboard
        </Link>

      </div>
    </div>
  );
}