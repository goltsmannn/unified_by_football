import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { BrowserRouter } from 'react-router-dom';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  //вызывает все по несколько раз чтобы удостовериться что эффекты не циклятся
    <BrowserRouter>
      <App />
    </BrowserRouter>
   //использовать disable cache в разработке
);

