import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Background from './components/background'
import './index.css'
import Create from './routes/create'
import Dance from './routes/dance'
import Home from './routes/home'
import Setup from './routes/setup'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
  },
  {
    path: '/create/:id?',
    element: <Create />,
  },
  {
    path: '/setup/:id',
    element: <Setup />,
  },
  {
    path: '/dance/:id',
    element: <Dance />,
  },
])

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <Background />
    <main className='mx-auto h-full'>
      <RouterProvider router={router} />
    </main>
  </React.StrictMode>
)
