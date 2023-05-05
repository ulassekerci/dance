import { FiArrowRight } from 'react-icons/fi'
import { useNavigate } from 'react-router-dom'
import { GenIcon } from 'react-icons'
import { useEffect } from 'react'

export default function Score() {
  const navigate = useNavigate()

  const dance = {
    id: parseInt(sessionStorage.getItem('danceId') ?? '0'),
    name: sessionStorage.getItem('danceName') ?? 'Dance Name',
    artist: sessionStorage.getItem('artistName') ?? 'Artist Name',
  }
  const scores = JSON.parse(sessionStorage.getItem('scores') ?? '[]') as number[]
  const avg = scores.reduce((a, b) => a + b, 0) / scores.length
  const totalScore = Math.round((avg / 4) * 10000)

  const handleKeys = (e: KeyboardEvent) => {
    if (e.key === 'Enter') navigate('/')
  }

  useEffect(() => {
    addEventListener('keydown', handleKeys)
    return () => {
      removeEventListener('keydown', handleKeys)
    }
  }, [])

  return (
    <div className='text-white flex flex-col gap-20'>
      <div className='px-8 pt-8 flex justify-between items-center'>
        <div className='flex flex-col pt-2 gap-1'>
          <span className='text-4xl font-bold'>{sessionStorage.getItem('danceName')}</span>
          <span className='text-xl font-semibold'>{sessionStorage.getItem('artistName')}</span>
        </div>
        <div onClick={() => navigate('/')} className='cursor-pointer'>
          <FiArrowRight size={48} />
        </div>
      </div>
      <div className='flex justify-start items-center'>
        <img
          src={`https://frdfvvrsd9yk.compat.objectstorage.eu-frankfurt-1.oraclecloud.com/dance/${dance.id}/coach.png`}
          className='w-[420px] h-[420px]'
        />

        <div className='relative flex flex-col justify-between items-center mr-30 gap-8 w-full'>
          <span className='text-9xl font-bold'>{totalScore}</span>
          <BigStars count={Math.round(totalScore / 2000)} />
        </div>
      </div>
    </div>
  )
}

const BigStars = ({ count }: { count: number }) => {
  return (
    <div className='flex justify-end gap-2 pt-2'>
      {count >= 1 ? yellowStar : emptyStar}
      {count >= 2 ? yellowStar : emptyStar}
      {count >= 3 ? yellowStar : emptyStar}
      {count >= 4 ? yellowStar : emptyStar}
      {count >= 5 ? yellowStar : emptyStar}
    </div>
  )
}

const yellowStar = GenIcon({
  tag: 'svg',
  attr: {
    viewBox: '0 0 24 24',
    fill: '#facc15',
    stroke: '#facc15',
    strokeWidth: '2',
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
  },
  child: [
    {
      tag: 'polygon',
      attr: {
        points: '12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2',
      },
      child: [],
    },
  ],
})({ size: 72 })

const emptyStar = GenIcon({
  tag: 'svg',
  attr: {
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'white',
    strokeWidth: '2',
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    opacity: '0.2',
  },
  child: [
    {
      tag: 'polygon',
      attr: {
        points: '12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2',
      },
      child: [],
    },
  ],
})({ size: 72 })
