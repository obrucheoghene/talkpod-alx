import ControlPanel from '../components/ControlPanel'
// import ParticipantPanel from '../components/ParticipantPanel'
// import ChatPanel from '../components/ChatPanel'
// import ActivityBoard from '../components/ActivityBoard'

const Conference = () => {
  return (
  <div className="bg-neutral-900 flex flex-col justify-between text-white h-screen overflow-hidden">

    <div className="text-center pt-2">
       <h5 className=''></h5>
     </div>
    <div className="flex-grow-1 flex flex-row items-stretch justify-stretch py-6 overflow-auto">
      {/* <ParticipantPanel/> */}

      {/* <ActivityBoard/> */}
 
      {/* <ChatPanel/> */}
    
    </div>

    <ControlPanel/>
  </div>
  )
}

export default Conference
