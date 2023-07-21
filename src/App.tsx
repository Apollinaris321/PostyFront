import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import {  RouterProvider } from 'react-router';
import { createBrowserRouter } from 'react-router-dom';
import Home from './pages/Home';
import { Post } from './pages/Post';
import { userContext, userInfo } from './user';
import Profile from './pages/Profile';
import TopNavbar from './components/Topnavbar';

function App() {

  const [user, setUser] = useState<userInfo | null>(null)

  const router = createBrowserRouter([
    {
      path: "/",
      element: <TopNavbar />,
      children:[
        {
          path: "/",
          element: <Home />,
        },
        {
          path: "/post/:id",
          element: <Post/>,
        },
        {
          path: "/profile/:id",
          element: <Profile />
        }
      ]
    }
  ]);

  return (
    <userContext.Provider value={{user,setUser}}>
      <RouterProvider router={router}/>
    </userContext.Provider>
  );
}

export default App;
