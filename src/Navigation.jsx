import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { HomePage } from './pages/HomePage.jsx';
import { LogIn } from './pages/LogIn.jsx'
import { SignIn } from './pages/SignIn.jsx';
import { NotFoundPage } from './pages/NotFoundPage.jsx';

const router = createBrowserRouter([
  {
  path: '/',
  element: <HomePage/>,
  errorElement: <NotFoundPage/> 
  },
  {
  path: '/LogIn',
  element: <LogIn/>,
  },
  {
  path: '/SignIn',
  element: <SignIn/>,
  },
]);

export function Navigation () {
    return (
        <RouterProvider router={router}/>
    )
}