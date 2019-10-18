import React from 'react';

import { ToastContainer, Slide } from 'react-toastify';

import './styles.scss';
import 'react-toastify/dist/ReactToastify.css';

const Toast: React.FunctionComponent<any> = (props) => (
  <ToastContainer
    className='cbk-toast'
    bodyClassName='cbk-toast-body'
    position='top-right'
    transition={Slide}
    autoClose={3000}
    hideProgressBar
    newestOnTop
    closeOnClick
    draggable
    pauseOnHover
  />
);

export default Toast;