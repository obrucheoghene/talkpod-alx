import { Tooltip } from 'antd'
import { useState } from 'react'
import { BsCameraVideoFill, BsFillCameraVideoOffFill } from 'react-icons/bs'

const CameraButton = () => {
    const [isClosed, setIsClosed] = useState(true);

    const toggleMute = () => {
        setIsClosed((prev) => !prev)
    }
  return (
    <Tooltip placement='top' title={isClosed? "Open your camera" : "Close your camera"}>
    <div onClick={toggleMute} className={`rounded-full h-12 w-12 
  flex flex-row items-center justify-center text-xl cursor-pointer ${isClosed ? "bg-slate-800" : "bg-blue-700" }`}>{isClosed ? <BsFillCameraVideoOffFill/> : <BsCameraVideoFill/>}</div>
    </Tooltip>
  )
}

export default CameraButton
