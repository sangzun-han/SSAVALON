import React from "react";
import ReactDOM from "react-dom/client";
import "./App.css";
import App from "./App";
import store from "./store/store";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { persistStore } from "redux-persist";

// import RegisterServiceWorker from './components/openVidu/RegisterServiceWorker';

export let persistor = persistStore(store);
const root = ReactDOM.createRoot(document.getElementById("root"));
console.log(`
.▄▄ · .▄▄ ·  ▄▄▄· ▌ ▐· ▄▄▄· ▄▄▌         ▐ ▄ 
▐█ ▀. ▐█ ▀. ▐█ ▀█▪█·█▌▐█ ▀█ ██•  ▪     •█▌▐█
▄▀▀▀█▄▄▀▀▀█▄▄█▀▀█▐█▐█•▄█▀▀█ ██▪   ▄█▀▄ ▐█▐▐▌
▐█▄▪▐█▐█▄▪▐█▐█ ▪▐▌███ ▐█ ▪▐▌▐█▌▐▌▐█▌.▐▌██▐█▌
 ▀▀▀▀  ▀▀▀▀  ▀  ▀. ▀   ▀  ▀ .▀▀▀  ▀█▄▀▪▀▀ █▪`);
root.render(
  // <React.StrictMode>
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <App />
    </PersistGate>
  </Provider>
  // </React.StrictMode>
);
// RegisterServiceWorker();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
