import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';

import {
  BrowserRouter as Router,
  Route,
  Redirect,
  // Link
} from "react-router-dom";

import InputPage from './components/InputPage/InputPage';
import ViewPage from './components/ViewPage/ViewPage';
import ViewExpectedPage from './components/ExpectedGuestsPage/ExpectedGuestsPage';
import LoginPage from './components/LoginPage/LoginPage';

function App() {
  const [verified, setVerified] = useState(false);

  let verifyToken = async () => {
    let result = await fetch('https://entrance-monitor.azurewebsites.net/verify');
    if (result.status === 200)
      setVerified(true);
  };

  if (!verified)
    verifyToken();

  if (!verified) {
    return (
      <LoginPage verify={verifyToken} />
    );
  }

  return (
    <Router>
      <Route exact path="/client/">
        <InputPage />
      </Route>
      <Route exact path="/client/login">
        {
          verified ? (<Redirect to="/client/" />) : null
        }
        <LoginPage verify={verifyToken} />
      </Route>
      <Route exact path="/client/viewGuests">
        <ViewPage />
      </Route>
      <Route exact path="/client/viewExpected">
        <ViewExpectedPage />
      </Route>
    </Router>
  );
}

export default App;
