import Head from "next/head";
import styles from "../../../styles/FeedbackCon.module.css";

export default function Confirmation() {
  return (
    <main className="main">
      <Head>
        <title>Confirmation</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className={styles.eventform}>
        <div className={styles.eventform_con}>
          Thank you. Your responses has been recorded
        </div>
      </div>
    </main>
  );
}
