import { Keypoint, Pose } from '@tensorflow-models/pose-detection'

interface Angle {
  angleData: {
    name: string
    min: number
    max: number
  }[]
  time: number
}

export const angles: Angle[] = []
export const scores: number[] = []

export const calculateAngles = (time: number, poses: Pose[]) => {
  if (!poses || poses.length === 0) return
  const leftElbowAngle = {
    name: 'left_elbow',
    angle: find_angle(poses[0].keypoints[5], poses[0].keypoints[7], poses[0].keypoints[9]),
  }
  const rightElbowAngle = {
    name: 'right_elbow',
    angle: find_angle(poses[0].keypoints[6], poses[0].keypoints[8], poses[0].keypoints[10]),
  }
  const leftShoulderAngle = {
    name: 'left_shoulder',
    angle: find_angle(poses[0].keypoints[6], poses[0].keypoints[5], poses[0].keypoints[7]),
  }
  const rightShoulderAngle = {
    name: 'right_shoulder',
    angle: find_angle(poses[0].keypoints[5], poses[0].keypoints[6], poses[0].keypoints[8]),
  }
  const angles = [leftElbowAngle, rightElbowAngle, leftShoulderAngle, rightShoulderAngle]
  angles.map((angle) => pushAngle(angle, time))
}

export const pushAngle = (angle: { name: string; angle: number }, time: number) => {
  if (angle.angle === 0) return
  const oldAngles = angles.find((angleData) => angleData.time === time)
  const oldAngleData = oldAngles?.angleData.find((angleData) => angleData.name === angle.name)

  if (oldAngleData) {
    oldAngleData.min = Math.min(oldAngleData.min, angle.angle)
    oldAngleData.max = Math.max(oldAngleData.max, angle.angle)
  } else if (oldAngles) {
    oldAngles.angleData.push({
      name: angle.name,
      min: angle.angle,
      max: angle.angle,
    })
  } else {
    angles.push({
      angleData: [
        {
          name: angle.name,
          min: angle.angle,
          max: angle.angle,
        },
      ],
      time,
    })
  }
}

const find_angle = (A: Keypoint, B: Keypoint, C: Keypoint) => {
  if (!A || !B || !C) return 0
  if (!A.score || !B.score || !C.score) return 0
  if (A.score < 0.3 || B.score < 0.3 || C.score < 0.3) return 0

  var AB = Math.sqrt(Math.pow(B.x - A.x, 2) + Math.pow(B.y - A.y, 2))
  var BC = Math.sqrt(Math.pow(B.x - C.x, 2) + Math.pow(B.y - C.y, 2))
  var AC = Math.sqrt(Math.pow(C.x - A.x, 2) + Math.pow(C.y - A.y, 2))
  const angle = Math.acos((BC * BC + AB * AB - AC * AC) / (2 * BC * AB))
  return angle * (180 / Math.PI)
}

export const compareAngles = (time: number, motionData?: string | null) => {
  if (!motionData) return
  const motion = JSON.parse(motionData) as Angle[]
  const playerAngles = angles.find((angle) => angle.time === time)?.angleData
  const danceAngles = motion.find((angle) => angle.time === time)?.angleData
  if (!playerAngles || !danceAngles) return

  const angleDifferences: number[] = []
  playerAngles.map((playerAngle) => {
    const danceAngle = danceAngles.find((angle) => angle.name === playerAngle.name)
    if (!danceAngle) return
    const difference = Math.abs(playerAngle.max - danceAngle.max) + Math.abs(playerAngle.min - danceAngle.min)
    angleDifferences.push(difference)
  })
  const lowest = Math.min(...angleDifferences)
  const secondLowest = Math.min(...angleDifferences.filter((difference) => difference !== lowest))
  const avg = (lowest + secondLowest) / 2
  return avg < 30 ? 'Perfect' : avg < 40 ? 'Super' : avg < 50 ? 'Good' : avg < 60 ? 'Ok' : 'X'
}
