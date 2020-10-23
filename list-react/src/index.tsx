// entry point for webpack
import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import App from "./App";

const rootEl = document.querySelector("#react-root")

const render = (Component: () => JSX.Element) => ReactDOM.render(    
    <BrowserRouter>
        <Component/>
    </BrowserRouter>
, rootEl);

render(App)

if (module.hot) {
  module.hot.accept('./App', () => {
    const NextApp = require('./App').default
    render(NextApp)
  })
}