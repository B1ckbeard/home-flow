import { Link, useNavigate } from 'react-router-dom'
import { useState, useEffect } from "react";

const Header = () => {
  const [user, setUser] = useState({});

  const navigate = useNavigate();

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('homeFlowUser')) || [];
    if (userData.token) {
      setUser({ 'username': userData.username, 'token': userData.token })
    } else {
      setUser({})
    }
    //console.log(userData)
    //console.log(user)
  }, []);

  const handleLogOut = () => {
    window.localStorage.removeItem('homeFlowUser');
    navigate('/login');
  }

  return (
    <div className="h-10 w-full bg-gray-700 flex items-center justify-between fixed px-4">
      <div>
        <Link
          to='/'
          className='flex items-center text-lg font-bold text-white'
        >
          Home Flow
        </Link>
      </div>
      {user.username ?
        <div className="flex flex-row items-center">
          <div className="text-white mr-2 px-2 border-r text-sm border-white">
            Вы вошли как: {user.username}
          </div>
          <button
            className='text-white text-sm'
            onClick={handleLogOut}
          >
            Выйти
          </button>
        </div>
        :
        <div className="flex flex-row">
          <Link
            to='/login'
            className='flex justify-center items-center text-sm text-white px-2 border-r border-white mr-2'
          >
            Войти
          </Link>
          <Link
            to='/register'
            className='flex justify-center items-center text-sm text-white'
          >
            Зарегистрироваться
          </Link>
        </div>
      }
    </div>
  )
}

export default Header
