import { createRoot } from "react-dom/client";
// import App from './App.tsx'
import { Provider } from "react-redux";
import "./index.css";
import Main from "./routes/main";
import { BrowserRouter } from "react-router-dom";
import { store } from "./util/redux/redux";
import Toastify from "./wrapper/Toast";

createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <BrowserRouter>
      <Toastify />
      <Main />
    </BrowserRouter>
  </Provider>
);
