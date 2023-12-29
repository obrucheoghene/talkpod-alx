import CameraButton from './CameraButton'
import EndCallButton from './EndCallButton'
import MessageButton from './MessageButton'
import MicButton from './MicButton'
import ParticipantButton from './ParticipantButton'
import ScreenShareButton from './ScreenShareButton'

const ControlPanel = () => {
  return (

    <div >
      <div className=" flex flex-row justify-between mb-2 container mx-auto">
        <ParticipantButton />

        <div className=' flex flex-row items-center justify-between gap-x-5'>
          <MicButton />
          <CameraButton />
          <ScreenShareButton />
          <EndCallButton />
        </div>

        <MessageButton />
      </div>
    </div>
  )
}

export default ControlPanel
