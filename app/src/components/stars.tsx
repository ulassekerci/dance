import { GenIcon } from 'react-icons'

export const Stars = ({ count }: { count: number }) => {
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
})({ size: 24 })

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
})({ size: 24 })
