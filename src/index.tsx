import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { RouterProvider, ScrollRestoration, createBrowserRouter } from 'react-router-dom';
import { PostAlone, PostDisplay } from './components/Post';
import { Homefeed } from './components/Homefeed';
import 'bootstrap/dist/css/bootstrap.min.css';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

const router = createBrowserRouter([
  {
    path: "/",
    element: <Homefeed></Homefeed>,
  },
  {
    path: "/post/:id",
    element: <PostDisplay></PostDisplay>,
  },
  {
    path: "/postpage/:id",
    element: <PostAlone></PostAlone>
  }
]);

root.render(
  <React.StrictMode>
    <RouterProvider router={router}/>
  </React.StrictMode>
);