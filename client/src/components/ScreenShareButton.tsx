import { Tooltip } from 'antd'
import { useState } from 'react'
import { MdScreenShare, MdStopScreenShare } from 'react-icons/md'

const ScreenShareButton = () => {
    const [isShared, setIsShared] = useState(true);

    const toggleMute = () => {
        setIsShared((prev) => !prev)
    }
  return (
    <Tooltip placement='top' title={isShared? "Share your screen" : "Stop sharing your screen"}>
    <div onClick={toggleMute} className={`rounded-full h-12 w-12 
  flex flex-row items-center justify-center text-xl cursor-pointer ${isShared ? "bg-slate-800" : "bg-blue-700" }`}>{isShared ? <MdStopScreenShare/> : <MdScreenShare/> }</div>
    </Tooltip>
  )
}

export default ScreenShareButton
