import { Dance } from '@prisma/client'
import axios from 'axios'
import { ReactNode, useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Spinner } from '../components/spinner'
import { FiHome, FiPlay, FiRefreshCcw } from 'react-icons/fi'
import { getDetector, handleNewFrame, initTensorflow } from '../functions/tensorflow'
import { compareAngles } from '../functions/scoring'
import { ScoreText } from '../components/scoreText'

export default function Dance() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [tfReady, setTfReady] = useState(false)
  const [paused, setPaused] = useState(false)
  const [score, setScore] = useState<string | null>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const webcamRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const webcamStream = useRef<MediaStream>()

  const dance = useRef<Dance>()
  const lastScored = useRef(0)

  const fetchDance = async () => {
    const danceFetch = await axios.get('http://localhost:5500/dances/' + id)
    dance.current = danceFetch.data
  }

  const handlePause = () => {
    if (videoRef.current) paused ? videoRef.current.play() : videoRef.current.pause()
    setPaused(!paused)
  }

  const startTensorFlow = async () => {
    await initTensorflow()
    await getDetector()
  }

  const startWebcam = async () => {
    webcamStream.current = await navigator.mediaDevices.getUserMedia({
      audio: false,
      video: { facingMode: 'user', width: 1920, height: 1080, frameRate: { ideal: 60 } },
    })
    if (!webcamStream.current || !webcamRef.current || !canvasRef.current) return
    webcamRef.current.srcObject = webcamStream.current
    webcamRef.current.play()

    await startTensorFlow()
    setTfReady(true)

    videoRef.current?.requestVideoFrameCallback(processFrame)
  }

  const processFrame = async (now: DOMHighResTimeStamp, metadata: VideoFrameCallbackMetadata) => {
    handleNewFrame(webcamRef.current, canvasRef.current, 1 / 10, false, Math.floor(metadata.mediaTime))
    judgeDance(Math.floor(metadata.mediaTime))
    videoRef.current?.requestVideoFrameCallback(processFrame)
  }

  const judgeDance = async (time: number) => {
    if (!dance || lastScored.current === time || lastScored.current === time - 1) return

    const score = compareAngles(time - 1, dance.current?.motionData)
    lastScored.current = time
    if (score) {
      setScore(score)
      setTimeout(() => {
        setScore(null)
      }, 1000)
    }
  }

  const stopWebcam = () => {
    if (!webcamRef.current || !webcamStream.current) return
    webcamStream.current.getTracks().forEach((track) => track.stop())
    webcamRef.current.pause()
    webcamRef.current.srcObject = null
  }

  const handleESC = (e: KeyboardEvent) => e.key === 'Escape' && handlePause()

  const handleNavigate = (route: string) => {
    stopWebcam()
    navigate(route)
  }

  useEffect(() => {
    startWebcam()
    fetchDance()
    window.addEventListener('keydown', handleESC)
    return () => {
      window.removeEventListener('keydown', handleESC)
    }
  }, [])

  useEffect(() => {
    if (!dance || !tfReady || paused) return
    if (!videoRef.current) return
    videoRef.current.play()
    videoRef.current.addEventListener('ended', () => handleNavigate('/'))
  }, [dance, tfReady])

  return (
    <>
      <div className={`flex h-screen ${(!dance || paused) && 'hidden'}`}>
        <div className='absolute top-0 left-0 right-0 bottom-0 bg-black -z-20' />
        <div className='absolute top-0 left-1/2 transform -translate-x-1/2'>
          <video
            ref={webcamRef}
            width={192}
            height={108}
            className='hidden absolute top-0 left-1/2 transform -translate-x-1/2 rounded-3xl -scale-x-100 -z-10'
          />
          <canvas ref={canvasRef} width={192} height={108} className='z-10' />
          <ScoreText score={score} />
        </div>
        <video
          src={`https://frdfvvrsd9yk.compat.objectstorage.eu-frankfurt-1.oraclecloud.com/dance/${id}/dance.mp4`}
          ref={videoRef}
        />
      </div>

      <div
        className={`absolute top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2 ${
          (!!dance || paused) && 'hidden'
        }`}
      >
        <Spinner />
      </div>

      <div className={`h-screen w-screen flex items-center justify-center gap-20 ${!paused && 'hidden'}`}>
        <PausedCard icon={<FiHome size={64} />} text='Menüye Dön' onClick={() => handleNavigate('/')} />
        <PausedCard icon={<FiRefreshCcw size={64} />} text='Baştan Başla' onClick={() => location.reload()} />
        <PausedCard icon={<FiPlay size={64} />} text='Devam Et' onClick={handlePause} />
      </div>
    </>
  )
}

const PausedCard = ({ icon, text, onClick }: { icon: ReactNode; text: string; onClick: () => void }) => {
  return (
    <div className='rounded-3xl w-80 h-96 bg-gradient-to-tr from-fuchsia-900 to-sky-900 text-white' onClick={onClick}>
      <div className='flex flex-col items-center justify-center gap-24 h-full bg-black bg-opacity-20 hover:bg-opacity-5 cursor-pointer rounded-3xl'>
        {icon}
        <span className='font-semibold text-3xl'>{text}</span>
      </div>
    </div>
  )
}
