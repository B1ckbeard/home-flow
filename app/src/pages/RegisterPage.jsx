import { useState } from 'react'
import Header from "../components/Header";
import axios from "axios";

const RegisterPage = () => {
  const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
  
    const register = async () => {
      try {
        const response = await axios.post('http://localhost:3001/api/auth/register', {
          username,
          password
        });
        if (response.data.token) {
          console.log("Вы зарегистрировались")
        } else {
          console.log("Ошибка при регистрации");
        }
      } catch (error) {
        console.error("Ошибка при регистрации", error);
      }
    }
  
    const handleSubmit = () => {
      register()
    }

  return (
    <>
      <Header />
      <div className="min-h-screen w-full flex items-center justify-center
      bg-gradient-to-r from-slate-200 to-slate-600">
        <form
          onSubmit={(e) => e.preventDefault()}
          className='w-1/3 h-56 mx-auto border-gray-500 rounded bg-slate-500 shadow-sm shadow-slate-800 p-4'
        >
          <h1 className='text-lg text-white text-center'>Регистрация</h1>
          <label className='text-xs text-gray-400 mb-1'>
            Username:
            <input
              type='text'
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder='Username'
              className='text-black w-full rounded bg-gray-400 border py-1 px-2 text-xs outline-none placeholder:text-gray-700'
            />
          </label>

          <label className='text-xs text-gray-400 mb-1'>
            Password:
            <input
              type='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder='Password'
              className='mb-6 text-black w-full rounded bg-gray-400 border py-1 px-2 text-xs outline-none placeholder:text-gray-700'
            />
          </label>

          <div className='w-full flex gap-8 justify-center'>
            <button
              type='submit'
              onClick={handleSubmit}
              className='flex justify-center items-center text-xs bg-gray-600 text-white shadow-sm shadow-slate-800
               rounded-sm py-2 px-4'
            >
              Зарегистрироваться
            </button>
          </div>
        </form>
      </div>
    </>
  )
}

export default RegisterPage
