import { Link } from 'react-router-dom'

const Header = () => {
  return (
    <div className="h-10 w-full bg-gradient-to-r from-slate-200 to-slate-600
    flex items-center justify-between fixed px-4 shadow-sm shadow-slate-800">
      <div className="">
        <Link
          to='/'
          className='flex items-center text-lg font-bold text-black'
        >
          Home Flow
        </Link>
      </div>
      <div className="flex flex-row">
        <Link
          to='/login'
          className='flex justify-center items-center text-xs text-white px-2 border-r mr-2'
        >
          Войти
        </Link>
        <Link
          to='/register'
          className='flex justify-center items-center text-xs text-white'
        >
          Зарегистрироваться
        </Link>
      </div>
    </div>
  )
}

export default Header
