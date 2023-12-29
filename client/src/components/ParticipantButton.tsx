import { Tooltip } from 'antd'
import { useState } from 'react'
import { FaUsers } from 'react-icons/fa'

const ParticipantButton = () => {
    const [show, setShow] = useState(true);

    const toggle = () => {
        setShow((prev) => !prev)
    }
  return (
    <Tooltip placement='top' title={show? "Show participants" : "Hide participants"}>
    <div onClick={toggle} className={`rounded-full h-12 w-12 
  flex flex-row items-center justify-center text-xl cursor-pointer ${show ? "bg-slate-800" : "bg-blue-700" }`}> <FaUsers/> </div>
    </Tooltip>
  )
}

export default ParticipantButton
