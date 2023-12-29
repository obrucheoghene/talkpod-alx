import { ChangeEvent, useContext, useState } from "react";
import Navbar from "../components/Navbar"
import { AuthContext } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import Axios from "../utils/Axios";

interface FormValues {
  name: string;
}

const NewRoom = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const [inputValues, setInputValues] = useState<FormValues>({
    name: '',
  })


  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setInputValues({
      ...inputValues,
      [name]: value
    })
  }

  const handleCreate = async () => {
    if(!user) return;
    setError("");
    const { name } = inputValues

    if (name.trim() === "") {
      setError("Complete form")
      return;
    }

    console.log(inputValues);

    try {
      const response = await Axios.post(`/rooms`, {name, userId: user.data.id});

      if (response.data) {
        console.log(response.data)

        navigate(`/${response.data.id}`)
      } else {
        console.log("Something went wrong");
        setError("Something went wrong")
      }
    } catch (error) {
      console.log(error);
    }
  }



  return (
    <div>
      <Navbar />
      <div className='flex items-center flex-col '>
        <h1 className="text-2xl font-bold my-8">Create new Room</h1>

        <div className=" flex flex-col w-[400px] gap-y-4">
          {error.trim() !== "" && <span className='error'>{error} </span>}

          <div className=" flex flex-col">
            <label htmlFor="" className="text-sm">Room name</label>
            <input type='text' placeholder="name"
              name='name'
              value={inputValues.name} onChange={handleInputChange} className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg h-12 px-3 " />
          </div>
          <button onClick={handleCreate} className=" btn bg-violet-500 text-white p-2.5">Create</button>
        </div>
      </div>
    </div>
  )
}

export default NewRoom
