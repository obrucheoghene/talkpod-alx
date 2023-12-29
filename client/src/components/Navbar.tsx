import logo from '../assets/talkpod-logo.png'
import ActionButton from './ActionButton'
import { useContext } from 'react'
import { AuthContext } from '../contexts/AuthContext'
import UserDropdown from './UserDropdown'
import { Link } from 'react-router-dom'

const Navbar = () => {
  const { user } = useContext(AuthContext)
  return (

    <nav className="bg-white h-fit py-3">
      <div className="container flex flex-wrap items-center justify-between mx-auto ">
        <Link to={'/'} className=' cursor-pointer'> <img src={logo} className=" h-10" alt="Talkpod Logo" />
        </Link>
        <div className="flex md:order-2">
          {!user && <Link to="/signin"><ActionButton text='Sign in' /></Link>}
          {!user && <Link to="/signup"><ActionButton text='Sign up' variant='outline' /></Link>}
          {user && <UserDropdown />}

          {/* <button data-collapse-toggle="navbar-cta" type="button" className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none " aria-controls="navbar-cta" aria-expanded="false">
            <AiOutlineAlignRight size={24}/>
          </button> */}
        </div>
        <div className="items-center justify-between hidden w-full md:flex md:w-auto md:order-1" id="navbar-cta">
          <ul className="flex flex-col font-medium md:p-0 mt-4 md:flex-row md:space-x-8 md:mt-0 md:border-0 ">
            {/* <li>
              <Link to="#" className="block  pl-3 pr-4   " aria-current="page">Home</Link>
            </li> */}

          </ul>
        </div>
      </div>
    </nav>

  )
}

export default Navbar
