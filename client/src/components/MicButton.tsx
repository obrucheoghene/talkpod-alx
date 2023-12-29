import { Tooltip } from 'antd'
import { useState } from 'react'
import { BsMicFill, BsMicMuteFill } from 'react-icons/bs'

const MicButton = () => {
    const [isMuted, setIsMuted] = useState(true);

    const toggleMute = () => {
        setIsMuted((prev) => !prev)
    }
  return (
    <Tooltip placement='top' title={isMuted? "Unmute" : "Mute"}>
    <div onClick={toggleMute} className={`rounded-full h-12 w-12 
  flex flex-row items-center justify-center text-xl cursor-pointer ${isMuted ? "bg-slate-800" : "bg-blue-700" }`}>{isMuted ? <BsMicMuteFill/> : <BsMicFill/>}</div>
    </Tooltip>
  )
}

export default MicButton
