import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { NotFoundPage } from '../pages/NotFoundPage.jsx';
import { WorkArea } from '../pages/WorkArea.jsx';
import { HomePage } from '../pages/HomePage.jsx';
import { LogIn } from '../pages/LogIn.jsx';
import { SignIn } from '../pages/SignIn.jsx';
import { ReviewCards } from '../pages/ReviewCards.jsx';
import { ReviewPredefinedDecks } from '../pages/ReviewPredefinedDecks.jsx';

const router = createBrowserRouter([
  {
  path: '/',
  element: <HomePage/>,
  errorElement: <NotFoundPage/> 
  },
  {
  path: '/logIn/',
  element: <LogIn/>,
  },
  {
  path: '/signIn/',
  element: <SignIn/>,
  },
  {
    path: '/workArea/',
    element: <WorkArea/>
  },
  {
    path: '/reviewCards/',
    element: <ReviewCards/>
  },
  {
    path: '/reviewPredefinedDecks/',
    element: <ReviewPredefinedDecks/>
  }
]);

export function Navigation () {
    return (
        <RouterProvider router={router}/>
    )
}