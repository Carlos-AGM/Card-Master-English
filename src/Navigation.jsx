import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { HomePage } from './HomePage.jsx';
import { LogIn } from './LogIn.jsx'
import { NotFoundPage } from './NotFoundPage.jsx';

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
]);

export function Navigation () {
    return (
        <RouterProvider router={router}/>
    )
}