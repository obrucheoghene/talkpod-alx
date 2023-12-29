import { Avatar, Card } from 'antd'
import {IoSend} from 'react-icons/io5'
const Chat = () => {
    return (
        <div className='flex flex-row gap-x-2'>
                <Avatar className='flex-shrink-0'>U</Avatar>
                <div className=' flex flex-col gap-y-1'>
                    <span className='font-semibold'>Wilfred Do</span>
                    <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quod commodi aspernatur cupiditate distinctio necessitatibus in.</p>

                </div>
        </div>
    )
}
const ChatPanel = () => {
  return (
    <Card title="Public chat"  size="small" className=' flex flex-col h-full w-72'>
    <div className='flex flex-col justify-between'>
        <div className=' flex-grow-1'>
            {[1,2,3,4].map((item) => <Chat key={item} />)}
        </div>

        <div className='flex flex-row justify-between items-center text-lg gap-x-2'>
            <input className='flex-grow-1 px-2 py-1' /> <IoSend className="flex-shrink-0 text-blue-700"/>
        </div>
    </div>
</Card>

  )
}

export default ChatPanel
