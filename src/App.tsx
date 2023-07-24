import  { useEffect, useState } from 'react';
import {  RouterProvider } from 'react-router';
import { createBrowserRouter } from 'react-router-dom';
import Home from './pages/Home';
import { Post } from './pages/Post';
import { userContext, userInfo } from './user';
import Profile from './pages/Profile';
import TopNavbar from './components/Topnavbar';
import { client } from './api';
import { Auth } from './pages/Auth';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {

  const [user, setUser] = useState<userInfo | null>(null)

  useEffect(() => {
    const getUserData = async () => {
      try{
        const response = await client.get("Profile")
        const userData = response.data;
        console.log("userdata: ", response);
        setUser({...userData})
      }catch(error){
        console.log("getuserdata error: ", error);
      }
    }
    getUserData()
  },[])

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
        },
        {
          path: "login",
          element: <Auth></Auth>
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
