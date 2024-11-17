import ChatWindow from "../components/ChatWindow";
import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <h1 style={{ textAlign: "center", margin: "20px 0" }}>
          우울한 친구를 위한 희망 챗봇
        </h1>
        <ChatWindow />
      </main>
    </div>
  );
}
