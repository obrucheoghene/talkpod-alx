import Navbar from "../components/Navbar";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Room as RoomType } from "../utils/types";
import { getRoomById, getUserRooms } from "../utils/helpers";
import { Alert, Card, Input, Spin } from "antd";
// import {HiHome} from "react-icons/hi2"
import { BsLink45Deg } from "react-icons/bs"
import Title from "antd/es/typography/Title";
import ActionButton from "../components/ActionButton";
import { IoAddCircle } from "react-icons/io5";

const Room = () => {
  const { user } = useContext(AuthContext);
  const { roomId } = useParams()
  const navigate = useNavigate();
  const baseUrl = window.location.origin;
  const [isCopied, setIsCopied] = useState(false);
  const invitLink = `${baseUrl}/${roomId}`;
  const [loading, setLoading] = useState(true);
  const [room, setRoom] = useState<RoomType>()
  const [userRooms, setUserRooms] = useState<RoomType[]>([])

  useEffect(() => {
    const getData = async () => {
      try {
        const room = await getRoomById(roomId as string);
        setRoom(room);


        if (user) {

          const userRooms = await getUserRooms(user.data.id);
          setUserRooms(userRooms)
          console.log('userRooms', userRooms)

        }
      } catch (error) {
        console.log(error);
      }
    }

    getData();
    setLoading(false)

  }, [roomId, user])


  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(invitLink);
      setIsCopied(true);

      setTimeout(() => {
        setIsCopied(false);
      }, 2000)
    } catch (error) {
      console.log("Unable to copy", error)
    }
  }

  if (loading) {
    return <Spin />
  }

  if (loading && !room) {
    return <Alert showIcon type="error" message="This room does not exist" />
  }

  return (
    <div>
      <Navbar />

      <div className=" w-full bg-violet-50 h-[400px]">
        <div className="container mx-auto py-14">
          <Title className='text-neutral-600'>{room?.name}</Title>

          <div className=" max-w-96 flex flex-col gap-y-2">
            <label htmlFor="" >Invitation link</label>
            <div className="flex gap-x-4">
              <Input defaultValue={`${baseUrl}/${roomId}`}
                prefix={<BsLink45Deg size={24} />} size="large"
                className=" outline-violet-400 focub" readOnly />
              <ActionButton text={isCopied ? 'Copied' : 'Copy'} color="violet" onClick={handleCopy} />
              <Link to={'/join'}><ActionButton text="Start"/>
</Link>
            </div>
          </div>
        </div>

      </div>
      <div className="container mx-auto" >
        <div className="flex items-center gap-x-3 justify-items-start my-4 ">
          <h1 className="text-xl font-bold mb-0">Rooms</h1>
          <Link to={'/new'} title="Create room " ><IoAddCircle size={26} className=" text-violet-500" /></Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 ">
          {userRooms.map((room) => <Card key={room.id} onClick={() => navigate(`/${room.id}`)} className=" cursor-pointer hover:border-violet-400"><Title className=" text-neutral-800" level={3} >{room.name}</Title></Card>)}
        </div>
      </div>

      {/* <Footer /> */}
    </div>
  )
}

export default Room
