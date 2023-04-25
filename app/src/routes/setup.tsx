import { useEffect, useRef, useState } from 'react'
import { Spinner } from '../components/spinner'
import { useNavigate, useParams } from 'react-router-dom'
import { FiArrowLeft } from 'react-icons/fi'
import { getDetector, handleNewFrame, initTensorflow } from '../functions/tensorflow'

export default function Setup() {
  const { id } = useParams()
  const navigate = useNavigate()
  const videoElement = useRef<HTMLVideoElement>(null)
  const canvasElement = useRef<HTMLCanvasElement>(null)
  const [startingTimer, setStartingTimer] = useState(5)
  const stream = useRef<MediaStream>()

  const startVideo = async () => {
    stream.current = await navigator.mediaDevices.getUserMedia({
      audio: false,
      video: { facingMode: 'user', width: 960, height: 540, frameRate: { ideal: 60 } },
    })
    if (!stream.current || !videoElement.current) return
    videoElement.current.srcObject = stream.current
    videoElement.current.play()

    await startTensorFlow()

    videoElement.current.requestVideoFrameCallback(async () => {
      handleNewFrame(videoElement.current, canvasElement.current, 1, true)
    })
  }

  const stopVideo = () => {
    if (!videoElement.current || !stream.current) return
    stream.current.getTracks().forEach((track) => track.stop())
    videoElement.current.pause()
    videoElement.current.srcObject = null
  }

  const startTensorFlow = async () => {
    await initTensorflow()
    await getDetector()
  }

  const handleKeys = (e: KeyboardEvent) => {
    let time = 5
    if (e.key === 'Escape') {
      stopVideo()
      navigate('/')
    } else if (e.key === 'Enter') {
      const timer = setInterval(() => {
        const newTime = time - 1
        setStartingTimer(newTime)
        time = newTime
        if (time === 0) {
          clearInterval(timer)
          stopVideo()
          navigate(`/dance/${id}`)
        }
      }, 1000)
    }
  }

  useEffect(() => {
    addEventListener('keydown', handleKeys)
    startVideo()
    return () => {
      removeEventListener('keydown', handleKeys)
      stopVideo()
    }
  }, [])

  return (
    <div className='text-white flex flex-col gap-20'>
      <div className='px-8 pt-8 flex justify-between items-start'>
        <div
          onClick={() => {
            stopVideo()
            navigate('/')
          }}
        >
          <FiArrowLeft size={48} />
        </div>
        <div className='flex flex-col pt-2 gap-1'>
          <span className='text-4xl font-bold'>Dynamite</span>
          <span className='text-xl font-semibold text-right'>BTS</span>
        </div>
      </div>
      <div className='flex justify-end items-center'>
        <div className='w-[960px] h-[540px] bg-white bg-opacity-5 rounded-3xl ml-8 relative'>
          <video ref={videoElement} className='hidden rounded-3xl absolute top-0 left-0 -z-20 transform -scale-x-100' />
          <canvas ref={canvasElement} width={960} height={540} />
        </div>
        <img
          src={`https://frdfvvrsd9yk.compat.objectstorage.eu-frankfurt-1.oraclecloud.com/dance/${id}/coach.png`}
          className='w-[420px] h-[420px]'
        />
      </div>
      <div className='pt-8 flex justify-end'>
        <span className='text-3xl px-12 font-bold w-56'>
          {startingTimer === 5
            ? ''
            : startingTimer === 4
            ? 'Starting'
            : startingTimer === 3
            ? 'Starting.'
            : startingTimer === 2
            ? 'Starting..'
            : 'Starting...'}
        </span>
      </div>
    </div>
  )
}
