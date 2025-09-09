import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import '../src/assets/main.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Provider } from 'react-redux';
import store from '../src/Store/index';
import { Toaster, toast } from "sonner";

// import "primereact/resources/themes/lara-light-cyan/theme.css";

// Your i18n configuration file
import { I18nextProvider } from "react-i18next";
import i18n from "./i18n";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  // <React.StrictMode>
  <>
    <Provider store={store}>
      {/* <ToastContainer /> */}
      <Toaster richColors position="top-right"
        toastOptions={{
          style: {
            fontSize: "1rem",
          }
        }} />
      <I18nextProvider i18n={i18n}>
        <App />
      </I18nextProvider>
    </Provider>
  </>
  // </React.StrictMode>
);


reportWebVitals();

