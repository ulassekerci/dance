import { useEffect, useRef, useState } from 'react'
import { detectPose, drawPose, getDetector, initTensorflow } from '../functions/tensorflow'
import { angles, calculateAngles } from '../functions/scoring'

export default function Create() {
  const start = useRef<HTMLInputElement>(null)
  const end = useRef<HTMLInputElement>(null)
  const firstSecond = useRef<HTMLInputElement>(null)
  const fps = useRef<HTMLInputElement>(null)
  const width = useRef<HTMLInputElement>(null)
  const height = useRef<HTMLInputElement>(null)
  const canvas = useRef<HTMLCanvasElement>(null)
  const [ready, setReady] = useState(false)
  const [progress, setProgress] = useState(0)

  const init = async () => {
    await initTensorflow()
    await getDetector()
    setReady(true)
  }

  const startProcessing = async () => {
    if (!ready || progress > 0) return
    const startingFrame = parseInt(start.current?.value ?? '0')
    const endingFrame = parseInt(end.current?.value ?? '0')
    const startingSecond = parseInt(firstSecond.current?.value ?? '0')
    const frameRate = parseInt(fps.current?.value ?? '0')
    const videoWidth = parseInt(width.current?.value ?? '0')
    const videoHeight = parseInt(height.current?.value ?? '0')
    //prettier-ignore
    if (isNaN(startingFrame) || isNaN(endingFrame) || isNaN(frameRate) || isNaN(videoWidth) || isNaN(videoHeight) || startingFrame > endingFrame || startingFrame < 0 || endingFrame < 0 || frameRate < 0 || videoWidth < 0 || videoHeight < 0 || !canvas.current) return
    canvas.current.width = videoWidth
    canvas.current.height = videoHeight

    const dirHandle = await window.showDirectoryPicker()
    for (let i = startingFrame; i <= endingFrame; i++) {
      const newProgress = Math.floor((i / (endingFrame - startingFrame + 1)) * 100)
      if (newProgress !== progress && newProgress !== 100) setProgress(newProgress)
      const fileHandle = await dirHandle.getFileHandle(`out-${i}.jpg`)
      const file = await fileHandle.getFile()
      await handleImage(file, startingSecond + Math.floor(i / frameRate))
    }
    setProgress(100)
    console.log(JSON.stringify(angles))
  }

  const handleImage = async (file: File, second: number) => {
    const imageBitmap = await createImageBitmap(file)
    const poses = await detectPose(imageBitmap)
    drawPose(poses, canvas.current, imageBitmap)
    calculateAngles(second, poses)
  }

  useEffect(() => {
    init()
  }, [])

  return (
    <div className='flex flex-col items-center gap-8 pt-8 text-white'>
      <canvas className='z-10' id='canvas' ref={canvas} />
      <div className='flex items-start gap-4'>
        <button
          className='bg-white bg-opacity-30 w-36 h-10 rounded-lg'
          onClick={startProcessing}
          style={{ opacity: ready ? 1 : 0.5 }}
        >
          {progress === 0 ? 'Start Processing' : progress === 100 ? 'Done' : progress + '%'}
        </button>
      </div>
      <div className='flex flex-col gap-2 items-center'>
        <div className='flex gap-4'>
          <input
            type='number'
            className='h-10 w-36 rounded-lg bg-white bg-opacity-30 text-center'
            placeholder='starting frame'
            ref={start}
          />
          <input
            type='number'
            className='h-10 w-36 rounded-lg bg-white bg-opacity-30 text-center'
            placeholder='ending frame'
            ref={end}
          />
        </div>
        <div className='flex gap-4'>
          <input
            type='number'
            className='h-10 w-36 rounded-lg bg-white bg-opacity-30 text-center'
            placeholder='fps'
            ref={fps}
          />
          <input
            type='number'
            className='h-10 w-36 rounded-lg bg-white bg-opacity-30 text-center'
            placeholder='starting second'
            ref={firstSecond}
          />
        </div>
        <div className='flex gap-4'>
          <input
            type='number'
            className='h-10 w-36 rounded-lg bg-white bg-opacity-30 text-center'
            placeholder='width'
            ref={width}
          />
          <input
            type='number'
            className='h-10 w-36 rounded-lg bg-white bg-opacity-30 text-center'
            placeholder='height'
            ref={height}
          />
        </div>
      </div>
    </div>
  )
}
