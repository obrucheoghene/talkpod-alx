import Title from 'antd/es/typography/Title'
import callSVG from '../assets/svg.svg'

const Hero = () => {
  return (
    <div className=" w-full bg-violet-50">
      <div className="max-w-screen-xl mx-auto flex flex-col gap-y-10  justify-between items-center py-14">
        <div className=" text-center">
          <Title  className=''>Welcome to <em className=' text-violet-500'>Talkpod!</em></Title>
          <p>Connects and amplifies your voice</p>
        </div>
        <div className="">
          <img src={callSVG} alt="call svg" className=' h-[500px]' />
        </div>
      </div>
    </div>
  )
}

export default Hero
