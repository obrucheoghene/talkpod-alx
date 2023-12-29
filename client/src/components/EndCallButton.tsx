import { Tooltip } from 'antd'
import { useState } from 'react'
import { MdCallEnd } from 'react-icons/md';

const EndCallButton = () => {
    const [end, setEnd] = useState(false);

    const toggleMute = () => {
        setEnd((prev) => !prev)
    }
  return (
    <Tooltip placement='top' title={end? "Leave meeting" : "Join meeting"}>
    <div onClick={toggleMute} className={`rounded-full h-12 w-12 
  flex flex-row items-center justify-center text-xl cursor-pointer bg-red-700`}> <MdCallEnd/></div>
    </Tooltip>
  )
}

export default EndCallButton
