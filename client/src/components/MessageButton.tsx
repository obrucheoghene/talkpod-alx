import { Tooltip } from 'antd'
import { useState } from 'react'
import { BsFillChatSquareTextFill } from 'react-icons/bs'

const MessageButton = () => {
    const [show, setShow] = useState(true);

    const toggle = () => {
        setShow((prev) => !prev)
    }
  return (
    <Tooltip placement='top' title={show? "Show participants" : "Hide participants"}>
    <div onClick={toggle} className={`rounded-full h-12 w-12 
  flex flex-row items-center justify-center text-xl cursor-pointer ${show ? "bg-slate-800" : "bg-blue-700" }`}> <BsFillChatSquareTextFill/> </div>
    </Tooltip>
  )
}

export default MessageButton
