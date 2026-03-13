import styles from "./styles.module.css";
import { useForm } from "react-hook-form";
import axios from "axios";
import { Link, useNavigate } from "react-router";
import toast from "react-hot-toast";
import type { Form } from "@/shared/interfaces/types";

const LoginPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Form>();

  const navigate = useNavigate();

  const onSubmit = async (data: Form) => {
    const username =
      data.username.charAt(0).toUpperCase() + data.username.slice(1);
    try {
      const response = await axios.post(
        "http://localhost:3001/api/auth/login",
        {
          username: username,
          password: data.password,
        },
      );

      if (response.data.token) {
        toast.success("Вы вошли в систему", {
          position: "bottom-center",
        });

        const userData = {
          username: username,
          userId: response.data.user._id,
          token: response.data.token,
        };
        window.localStorage.setItem("homeFlowUser", JSON.stringify(userData));
        navigate("/");
      } else {
        toast.error("Ошибка при авторизации", {
          position: "bottom-center",
        });
      }
    } catch (error) {
      console.error("Неверные учетные данные", error);
    }
  };

  return (
    <>
      <div className={styles.container}>
        <form onSubmit={handleSubmit(onSubmit)} className={styles.loginForm}>
          <h1 className={styles.formTitle}>Авторизация</h1>

          <div className={styles.formFields}>
            <input
              type="text"
              {...register("username", {
                required: "Обязательно для заполнения",
              })}
              placeholder="Логин"
              className={`${styles.inputField} ${errors.username ? styles.inputError : ""}`}
            />
            {errors.username && (
              <p className={styles.inputErrorText}>{errors.username.message}</p>
            )}
            <input
              type="password"
              {...register("password", {
                required: "Обязательно для заполнения",
                minLength: {
                  value: 6,
                  message: "Пароль должен содержать не менее 6 символов",
                },
              })}
              placeholder="Пароль"
              className={`${styles.inputField} 
                ${errors.password ? styles.inputError : ""}`}
            />
            {errors.password && (
              <p className={styles.inputErrorText}>{errors.password.message}</p>
            )}
          </div>

          <div className={styles.formButtons}>
            <button type="submit" className={styles.loginButton}>
              Войти
            </button>
            <Link to="/register" className={styles.registerLink}>
              Зарегистрироваться
            </Link>
          </div>
        </form>
      </div>
    </>
  );
};

export default LoginPage;
