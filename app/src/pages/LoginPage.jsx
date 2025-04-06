import { useForm } from 'react-hook-form'
import axios from "axios";
import { Link, useNavigate } from 'react-router-dom'
import Header from "../components/Header";
import toast, { Toaster } from 'react-hot-toast';

const LoginPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const navigate = useNavigate();

  const onSubmit = async (data) => {
    const username = data.username.charAt(0).toUpperCase()+ data.username.slice(1);
    try {
      const response = await axios.post('http://localhost:3001/api/auth/login', {
        username: username,
        password: data.password
      });

      if (response.data.token) {
        toast.success('Вы вошли в систему', {
          position: "bottom-center"
        })

        const userData = {
          username: username,
          userId: response.data.user._id,
          token: response.data.token
        };
        window.localStorage.setItem('homeFlowUser', JSON.stringify(userData))
        navigate('/');
      } else {
        toast.error('Ошибка при авторизации', {
          position: "bottom-center"
        })
      }
    } catch (error) {
      console.error("Неверные учетные данные", error);
    }
  }

  return (
    <>
      <Header />
      <Toaster />
      <div className="min-h-screen w-full flex items-center justify-center bg-gray-100">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className='w-1/3 h-auto rounded-lg bg-white shadow-lg p-4'
        >
          <h1 className='text-lg text-black text-center'>Авторизация</h1>

          <div className='mb-2'>
            <label className='text-xs text-black mb-1'>
              Username:
              <input
                type='text'
                {...register('username', { required: 'Обязательное поле' })}
                placeholder='Username'
                className={`text-black w-full rounded border py-1 px-2 text-xs outline-none ${errors.username ? 'border-red-500' : ''}`}
              />
            </label>
            {errors.username && (
              <p className='text-red-500 text-xs mt-1'>{errors.username.message}</p>
            )}
          </div>

          <div className='mb-2'>
            <label className='text-xs text-black mb-1'>
              Password:
              <input
                type='password'
                {...register('password', {
                  required: 'Обязательное поле',
                  minLength: {
                    value: 6,
                    message: 'Пароль должен содержать не менее 6 символов'
                  }
                })}
                placeholder='Password'
                className={`text-black w-full rounded border py-1 px-2 text-xs outline-none 
                ${errors.password ? 'border-red-500' : ''}`}
              />
            </label>
            {errors.password && (
              <p className='text-red-500 text-xs mt-1'>{errors.password.message}</p>
            )}
          </div>

          <div className='w-full flex gap-8 justify-center mt-4'>
            <button
              type='submit'
              className='flex justify-center items-center text-xs bg-gray-700 text-white rounded py-2 px-4'
            >
              Войти
            </button>
            <Link
              to='/register'
              className='flex justify-center items-center text-xs text-decoration-line: underline'
            >
              Зарегистрироваться
            </Link>
          </div>
        </form>
      </div>
    </>
  )
}

export default LoginPage
