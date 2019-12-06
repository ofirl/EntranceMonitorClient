import React from 'react';
import logo from './logo.svg';
import './App.css';

import {
  BrowserRouter as Router,
  Route,
  // Link
} from "react-router-dom";

import InputPage from './components/InputPage/InputPage';
import ViewPage from './components/ViewPage/ViewPage';
import ViewExpectedPage from './components/ExpectedGuestsPage/ExpectedGuestsPage';

function App() {
  return (
    <Router>
      <Route exact path="client/">
        <InputPage />
      </Route>
      <Route exact path="client/viewGuests">
        <ViewPage />
      </Route>
      <Route exact path="client/viewExpected">
        <ViewExpectedPage />
      </Route>
    </Router>
    // <div className="App">
    //   <header className="App-header">
    //     <img src={logo} className="App-logo" alt="logo" />
    //     <p>
    //       Edit <code>src/App.js</code> and save to reload.
    //     </p>
    //     <a
    //       className="App-link"
    //       href="https://reactjs.org"
    //       target="_blank"
    //       rel="noopener noreferrer"
    //     >
    //       Learn React
    //     </a>
    //   </header>
    // </div>
  );
}

export default App;
