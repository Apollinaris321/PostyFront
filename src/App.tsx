import React from 'react';
import { Homefeed } from './components/Homefeed';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn Reactaa
        </a>
      </header>
      <div>
        <Homefeed></Homefeed>
      </div>
    </div>
  );
}

export default App;
