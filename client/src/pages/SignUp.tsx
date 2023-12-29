import { ChangeEvent, useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom';

import Axios from '../utils/Axios';
import { User } from '../utils/types';
import { AuthContext } from '../contexts/AuthContext';
import { getUserHomeRoom } from '../utils/helpers';

import { Link } from 'react-router-dom'
import logo from '../assets/talkpod-logo.png'


interface FormValues {
    name: string;
    email: string;
    password: string;
}


const SignIn = () => {
    const { setUser } = useContext(AuthContext);
    const navigate = useNavigate();
    const [error, setError] = useState("");
    const [inputValues, setInputValues] = useState<FormValues>({
        name: '',
        email: '',
        password: ''
    })

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setInputValues({
            ...inputValues,
            [name]: value
        })
    }

    const handleSignUp = async () => {
        setError("");
        const { name, email, password } = inputValues

        if (name.trim() === "" || email.trim() === "" || password.trim() === "") {
            setError("Complete form")
            return;
        }

        try {
            const response = await Axios.post(`/auth/signup`, inputValues);
            const user: User = response.data;

            if (user && user.token) {
                setUser(user);

                const room = await getUserHomeRoom(user.data.id)
                navigate(`/${room.id}`)
            } else {
                console.log("Something went wrong");
                setError("Something went wrong")
            }
        } catch (error) {
            console.log(error);
        }
    }
    return (
        <>
            <div className='flex flex-col gap-y-4 justify-center  items-center h-screen bg-gray-100'>
                <Link to={'/'} className=' cursor-pointer'> <img src={logo} className=" h-10" alt="Talkpod Logo" /></Link>
                <div className=' flex flex-col bg-white rounded-md w-[400px] p-8 gap-y-4'>
                    <p className='text-center font-semibold text-lg'>Create a new account</p>
                    {error.trim() !== "" && <span className='error'>{error} </span>}

                    <div className=" flex flex-col">
                        <label htmlFor="" className="text-sm">Fullname</label>
                        <input type='text' name='name' placeholder="Fullname" required
                            value={inputValues.name} onChange={handleInputChange} className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg h-12 px-3 " />
                    </div>

                    <div className=" flex flex-col">
                        <label htmlFor="" className="text-sm">Email</label>
                        <input type='email' name='email' placeholder="Email" required
                            value={inputValues.email} onChange={handleInputChange} className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg h-12 px-3 " />
                    </div>
                    <div className="flex flex-col">
                        <label htmlFor="" className="text-sm">Password</label>
                        <input type='password' name="password" placeholder="Password" required
                            value={inputValues.password} onChange={handleInputChange} className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg h-12 px-3" />
                    </div>
                    <button onClick={handleSignUp} className=" btn bg-violet-500 text-white p-2.5">Sign Up</button>
                    <p className='text-center  text-sm'>Already have an account? <Link className='text-violet-500 cursor-pointer' to='/signin'>Signin</Link></p>

                </div>
            </div>
        </>
    )
}

export default SignIn
