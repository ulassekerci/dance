import { ReactNode } from 'react'

export const MenuIcon = ({ icon, active }: { icon: ReactNode; active?: boolean }) => {
  const inactiveStyle =
    'w-12 h-12 bg-gradient-to-b from-slate-700 to-transparent rounded-full grid place-content-center border border-opacity-50 border-white cursor-pointer'
  const activeStyle =
    'w-12 h-12 bg-gradient-to-tr from-sky-900 to-fuchsia-900 rounded-full grid place-content-center border-2 border-fuchsia-500 border-opacity-50 cursor-pointer'
  return <div className={active ? activeStyle : inactiveStyle}>{icon}</div>
}
