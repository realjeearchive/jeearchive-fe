// BottomConsentBar.tsx
import Link from "next/link";
import styles from "./BottomConsentBar.module.css";

interface Props {
  attemptHref: string;
  note: string;          // <— add this
}

export function BottomConsentBar({ attemptHref, note }: Props) {
  return (
    <footer className={styles.bottomBar}>
      <div className={styles.inner}>
        <div className={styles.left}>
          <p className={styles.noteRed}>
            {note}
          </p>

          <label className={styles.checkboxRow}>
            <input
              type="checkbox"
              defaultChecked
              className={styles.checkbox}
            />
            <span className={styles.checkboxText}>
              I have read and understood the instructions. All computer
              hardware allotted to me are in proper working condition. I
              declare that I am not in possession of / not wearing / not
              carrying any prohibited gadget like mobile phone, bluetooth
              devices etc. If any prohibited material with me into the
              Examination Hall, I agree that in case of not adhering to the
              instructions, I shall be liable to be debarred from this Test
              and/or to disciplinary action, which may include ban from
              future Tests / Examinations.
            </span>
          </label>
        </div>

        <div className={styles.right}>
          <Link href={attemptHref} className={styles.readyButton}>
            I am ready to begin
          </Link>
        </div>
      </div>
    </footer>
  );
}
