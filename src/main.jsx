import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.scss";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter } from "react-router-dom";
import store from "./redux-thunk/configureStore";
import { Provider } from "react-redux";
import { createRoot } from "react-dom/client";
import "./common/axiosSetup.js";
import { TourProvider } from "@reactour/tour";
const container = document.getElementById("root");
const root = createRoot(container);

const tourConfig = [
  {
    selector: '[data-tut="reactour__iso"]',
    content: () => (
      <div className="flex flex-col gap-3" >
        <img src="./abc4.png" alt="" />
      </div>
    ),
    position: "right"

  },
  {
    selector: '[data-tut="reactour__style"]',
    content: () => (
      <div className="flex flex-col gap-3" >
        <img src="./abc5.png" alt="" />
    </div>
    ),
    style: {
      backgroundColor: "black",
      color: "white"
    }
  },
  {
    selector: '[data-tut="reactour__goTo"]',
    content: ({ goTo }) => (
      <div className="flex flex-col gap-3" >
      <img src="./abc6.png" alt="" />
  </div>
    )
  },
  {
    selector: '[data-tut="reactour__position"]',
    content: () => (
      <div className="flex flex-col gap-3" >
      <img src="./abc8.png" alt="" />
  </div>
    ),
    position: "left"
  }
];
root.render(
  <React.StrictMode>
   
      <Provider store={store}>
        <BrowserRouter>
        <TourProvider
    steps={tourConfig}
    // maskClassName="mask"
    // className="helper"
    // rounded={5}
 
  >
          <App />
            </TourProvider>
        </BrowserRouter>
      </Provider>
  </React.StrictMode>
);
