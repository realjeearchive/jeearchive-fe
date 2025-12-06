// app/dashboard/layout.tsx
import Sidebar from "../../components/layout/Sidebar/Sidebar";
import "../globals.css"; // if needed
import styles from "./layout.module.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>){
  return (
    <div className={styles.appWrap}>
      <Sidebar />
      <main className={styles.dashboard}>{children}</main>
    </div>
  );
}
