import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

export const fileServerURL = 'http://localhost:3001/api';
export const socketServerURL = 'http://localhost:4000/';

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);
