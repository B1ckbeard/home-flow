import styles from "./styles.module.css";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import type { Form } from "@/shared/interfaces/types";

const RegistrationPage = () => {
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
        "http://localhost:3001/api/auth/register",
        {
          username: username,
          password: data.password,
        },
      );
      console.log(response);
      if (response.data.token) {
        toast.success("Вы успешно зарегистрировались!", {
          position: "bottom-center",
        });
        const userData = {
          username: username,
          userId: response.data.newUser._id,
          token: response.data.token,
        };
        window.localStorage.setItem("homeFlowUser", JSON.stringify(userData));
        navigate("/");
      }
      //  else {
      //   toast.error('Ошибка при регистрации', {
      //     position: "bottom-center"
      //   })
      // }
    } catch (error) {
      console.error("Ошибка при регистрации", error);
    }
  };

  return (
    <>
      <Toaster />
      <div className={styles.container}>
        <form onSubmit={handleSubmit(onSubmit)} className={styles.registerForm}>
          <h1 className={styles.formTitle}>Регистрация</h1>

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
            <button type="submit" className={styles.registerButton}>
              Зарегистрироваться
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default RegistrationPage;
