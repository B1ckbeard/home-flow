import { Header } from "@/widgets/header";
import styles from "./styles.module.css";
import { Outlet } from "react-router";
import { Toaster } from "react-hot-toast";

const BaseLayout = () => {
  return (
    <div className={styles.app}>
      <Header />
      <main className={styles.main}>
        <Toaster />
        <Outlet />
      </main>
    </div>
  );
};

export default BaseLayout;
