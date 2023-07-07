import React from 'react';
import { Solver } from './components/Solver';

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
        <Solver></Solver>
      </div>
    </div>
  );
}

export default App;
