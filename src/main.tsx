import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App/00--App/App.tsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import IndexPage from './App/01--IndexPage/IndexPage.tsx'
import Variete from './App/02--Variete/Variete.tsx'


const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: <IndexPage />
      },
      {
        path: "variete",
        element: <Variete />
      }
    ]
  }
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
