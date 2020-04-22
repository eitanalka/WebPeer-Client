import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';

export const fileServerURL = 'http://localhost:3001/api';

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);
