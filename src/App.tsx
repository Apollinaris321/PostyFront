import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import {  RouterProvider } from 'react-router';
import { createBrowserRouter } from 'react-router-dom';
import Home from './components/Home';
import { Post } from './components/Post';
import { userContext, userInfo } from './user';
import Profile from './components/Profile';
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
          element: <Profile></Profile>
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
