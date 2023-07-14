import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Router, RouterProvider } from 'react-router';
import { createBrowserRouter } from 'react-router-dom';
import Home from './components/Home';
import { Post } from './components/Post';
import { userContext, userInfo } from './user';

function App() {

  const [user, setUser] = useState<userInfo | null>({email: "", username: ""})

  const router = createBrowserRouter([
    {
      path: "/",
      element: <Home></Home>,
    },
    {
      path: "/post/:id",
      element: <Post/>,
    }
  ]);
  return (
    <userContext.Provider value={{user,setUser}}>
      <RouterProvider router={router}/>
    </userContext.Provider>
  );
}

export default App;
