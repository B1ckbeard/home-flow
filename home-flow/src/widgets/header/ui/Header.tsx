import { Link, useNavigate } from "react-router";
import styles from "./styles.module.css";
import type { User } from "@/shared/interfaces/types";
import { getUser } from "@/shared/hooks/useAuth";

const Header = () => {
  const user: User | null = getUser();

  const navigate = useNavigate();
  const handleLogOut = () => {
    window.localStorage.removeItem("homeFlowUser");
    navigate("/login");
  };

  return (
    <div className={styles.header}>
      <div className={styles.titleBlock}>
        <Link to="/" className={styles.headerLink}>
          Home Flow
        </Link>
      </div>
      {user?.username ? (
        <div className={styles.auth}>
          <div className={styles.authText}>Вы вошли как: {user.username}</div>
          <div className={styles.authDivider}>|</div>
          <button className={styles.authButton} onClick={handleLogOut}>
            Выйти
          </button>
        </div>
      ) : (
        <div className={styles.auth}>
          <Link to="/login" className={styles.authLinkLeft}>
            Войти
          </Link>
          <div className={styles.authDivider}>|</div>
          <Link to="/register" className={styles.authLink}>
            Зарегистрироваться
          </Link>
        </div>
      )}
    </div>
  );
};

export default Header;
