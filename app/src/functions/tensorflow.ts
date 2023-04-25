import * as tf from '@tensorflow/tfjs-core'
import '@tensorflow/tfjs-backend-webgl'
import { SupportedModels, createDetector, movenet, TrackerType } from '@tensorflow-models/pose-detection'
import type { PoseDetector, Pose } from '@tensorflow-models/pose-detection'
import { getAdjacentPairs } from '@tensorflow-models/pose-detection/dist/util'
import { calculateAngles } from './scoring'

let tfInitiated = false
export let detector: PoseDetector | null = null

export const initTensorflow = async () => {
  if (tfInitiated) return
  if (!tf.backend()) await tf.setBackend('webgl')
  await tf.ready()
  tfInitiated = true
}

export const getDetector = async () => {
  if (detector) return
  detector = await createDetector(SupportedModels.MoveNet, {
    runtime: 'mediapipe',
    modelType: movenet.modelType.SINGLEPOSE_THUNDER,
    enableSmoothing: true,
    enableTracking: true,
    trackerType: TrackerType.Keypoint,
  })
}

export const detectPose = async (input: HTMLVideoElement | ImageBitmap) => {
  if (!detector) return []
  const poses = await detector.estimatePoses(input)
  return poses
}

const mirrorPose = (pose: Pose, width: number, resolutionMultipler?: number) => {
  const mirroredKeypoints = pose.keypoints.map((kp) => {
    return {
      ...kp,
      x: width / (resolutionMultipler ?? 1) - kp.x,
      name: kp.name?.includes('right') ? kp.name.replace('right', 'left') : kp.name?.replace('left', 'right'),
    }
  })
  return {
    ...pose,
    keypoints: mirroredKeypoints,
  }
}

export const drawPose = (poses: Pose[], canvas: HTMLCanvasElement | null, image?: ImageBitmap) => {
  if (!canvas) return
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  if (image) ctx.drawImage(image, 0, 0, canvas.width, canvas.height)
  ctx.lineWidth = 4

  const colors = ['cyan', 'red', 'yellow', 'green', 'orange', 'white']

  poses.map((pose) => {
    const color = pose.id ? colors[pose.id % 6] : colors[0]
    ctx.strokeStyle = ctx.fillStyle = color
    if (!pose.score || pose.score < 0.3) return
    ctx.beginPath()

    drawHead(pose, ctx)

    getAdjacentPairs(SupportedModels.MoveNet).map(([first, second]) => {
      const kp1 = pose.keypoints[first]
      const kp2 = pose.keypoints[second]
      if (
        kp1.name === 'nose' ||
        kp2.name === 'nose' ||
        kp1.name === 'left_ear' ||
        kp2.name === 'left_ear' ||
        kp1.name === 'right_ear' ||
        kp2.name === 'right_ear' ||
        kp1.name === 'left_eye' ||
        kp2.name === 'left_eye' ||
        kp1.name === 'right_eye' ||
        kp2.name === 'right_eye'
      )
        return
      if (kp1 && kp2) {
        if (!kp1.score || !kp2.score) return
        if (kp1.score > 0.3 && kp2.score > 0.3) {
          ctx.moveTo(kp1.x, kp1.y)
          ctx.lineTo(kp2.x, kp2.y)
          ctx.stroke()
        }
      }
    })
  })
}

const drawHead = (pose: Pose, ctx: CanvasRenderingContext2D) => {
  if (!pose.keypoints) return
  const leftEye = pose.keypoints.find((kp) => kp.name === 'left_eye')
  const rightEye = pose.keypoints.find((kp) => kp.name === 'right_eye')

  const findCenter = () => {
    if (leftEye && rightEye) {
      return {
        x: (leftEye.x + rightEye.x) / 2,
        y: (leftEye.y + rightEye.y) / 2 + (leftEye.y - rightEye.y) * 0.25,
        radius: Math.abs(leftEye.x - rightEye.x) * 1.25,
      }
    } else {
      return {
        x: 0,
        y: 0,
        radius: 0,
      }
    }
  }

  const { x, y, radius } = findCenter()

  ctx.ellipse(x, y, radius, radius, Math.PI / 4, 0, 2 * Math.PI)
  ctx.stroke()
}

const multiplyPoseKeypoints = (pose: Pose, resolutionMultipler?: number) => {
  if (!resolutionMultipler) return pose
  const multipliedKeypoints = pose.keypoints.map((kp) => {
    return {
      ...kp,
      x: kp.x * resolutionMultipler,
      y: kp.y * resolutionMultipler,
    }
  })
  return {
    ...pose,
    keypoints: multipliedKeypoints,
  }
}

export const handleNewFrame = async (
  video: HTMLVideoElement | null,
  canvas: HTMLCanvasElement | null,
  resolutionMultipler?: number,
  callback?: boolean,
  time?: number
) => {
  if (!detector) return console.log('No detector')
  if (!video || !canvas) return console.log('No video or canvas')
  const poses = await detectPose(video)
  const mirroredPoses = poses.map((pose) => mirrorPose(pose, canvas.width, resolutionMultipler))
  const multipliedPoses = mirroredPoses.map((pose) => multiplyPoseKeypoints(pose, resolutionMultipler))

  drawPose(multipliedPoses, canvas)
  if (time) calculateAngles(time, mirroredPoses)
  if (callback) video.requestVideoFrameCallback(() => handleNewFrame(video, canvas, resolutionMultipler, callback))
}
