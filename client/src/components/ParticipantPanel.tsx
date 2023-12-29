import { Avatar, Card } from 'antd'

const Participant = () => {
    return (
        <div className=' flex flex-row items-center gap-x-2'>
            <Avatar>U</Avatar>
            <span>User Mav</span>
        </div>
    )
}
const ParticipantPanel = () => {
  return (
    <Card title="Participants" size="small" className=' w-72'>
        <div className=' flex flex-col gap-y-2'>
        {[1,2,3,4,5].map((item)=> <Participant key={item}/>)}
        </div>
    </Card>
  )
}

export default ParticipantPanel
