import { useEffect } from 'react'
import { Spinner } from '../components/spinner'
import { useDanceStore } from '../store'
import { FiHome, FiSearch, FiSettings } from 'react-icons/fi'
import { MenuIcon } from '../components/menuIcon'
import { Stars } from '../components/stars'
import { useNavigate } from 'react-router-dom'

export default function Home() {
  const { dances, isFetched, fetchDances } = useDanceStore()
  const navigate = useNavigate()

  useEffect(() => {
    if (!isFetched) fetchDances()
  }, [])

  return (
    <>
      {isFetched && dances.length > 0 ? (
        <div className='flex justify-between px-8 py-10 h-full text-white'>
          <div className='w-12 h-full flex flex-col justify-between'>
            <MenuIcon icon={<FiSearch size={24} />} />
            <div className='flex flex-col gap-4'>
              <MenuIcon icon={<FiHome size={24} />} active={true} />
              <MenuIcon icon={<span className='text-lg font-bold'>JD</span>} />
              <MenuIcon icon={<span className='text-lg font-bold'>DC</span>} />
              <MenuIcon icon={<span className='text-lg font-bold'>YT</span>} />
            </div>

            <MenuIcon icon={<FiSettings size={24} />} />
          </div>

          <div className='w-full h-full pl-16'>
            <div className='grid grid-cols-4'>
              {dances.map((dance) => (
                <div
                  className='w-72 flex flex-col cursor-pointer'
                  onClick={() => {
                    sessionStorage.setItem('danceName', dance.name)
                    sessionStorage.setItem('artistName', dance.artist)
                    navigate(`/setup/${dance.id}`)
                  }}
                  key={dance.id}
                >
                  <span className='font-semibold text-lg pb-1'>{dance.name}</span>
                  <img
                    src={`https://frdfvvrsd9yk.compat.objectstorage.eu-frankfurt-1.oraclecloud.com/dance/${dance.id}/thumbnail.png`}
                  />
                  <Stars count={dance.stars} />
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className='absolute top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2'>
          <Spinner />
        </div>
      )}
    </>
  )
}
