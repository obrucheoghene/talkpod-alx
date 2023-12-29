import { Avatar, Card, } from 'antd'
import { useEffect, useRef } from 'react';
import { twMerge } from 'tailwind-merge';

const Participant = () => {
    const videoRef = useRef<HTMLVideoElement>(null);
    useEffect(() => {
        const getCameraStream = async () => {
            try {
              const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      
              if (videoRef.current) {
                videoRef.current.srcObject = stream;
              }
            } catch (error) {
              console.error('Error accessing the camera:', error);
            }
          };
      
        //   getCameraStream();
      
          // Clean up the video stream when the component is unmounted
          return () => {
            if (videoRef.current) {
              const stream = videoRef.current.srcObject as MediaStream;
              if (stream) {
                stream.getTracks().forEach((track) => track.stop());
              }
            }
          };
    }, [])
    return (
        <div
        className="bg-neutral-800 rounded-md flex flex-col items-center justify-center"
        style={{ aspectRatio: '16/9' }} // Maintain a 16:9 aspect ratio for each participant
    >
        {/* <Avatar size="large" className='h-20 w-20 flex justify-center items-center text-xl'>{1}</Avatar>
         <p className='text-center'>Participant gletieo</p> */}
         <video ref={videoRef} autoPlay playsInline muted className='w-full h-auto' />

    </div>
    )
}

const ActivityBoard = () => {


    const participants = [1];
    const getGridClass = (count: number) => {
        if (count <= 2) {
          return 'grid-cols-1 grid-rows-1';
        } else if (count <= 4) {
          return 'grid-cols-2 grid-rows-2';
        } else if (count <= 9) {
          return 'grid-cols-3 grid-rows-3';
        } else if (count <= 16) {
          return 'grid-cols-4 grid-rows-4';
        } else {
          // Add more cases as needed for larger grids
          return 'grid-cols-4 grid-rows-4'; // Default to 4x4 for more than 16 participants
        }
      };
    
    // const responsiveGridClass = "grid-cols-1 grid-rows-1 md:grid-cols-2 md:grid-rows-2 lg:grid-cols-3 lg:grid-rows-3 xl:grid-cols-4 xl:grid-rows-4";
    const gridClass = getGridClass(participants.length);

    return (
        <Card size="small" className='flex-grow-1 flex flex-col bg-neutral-900  border-none text-white h-full overflow-auto'>
            <div className={twMerge(`grid ${gridClass} gap-2 p-2  max-h-full w`)}>
                {participants.map((_participant, index) => (
                    <Participant key={index}/>
                ))}
            </div>
        </Card>
    )
}

export default ActivityBoard
