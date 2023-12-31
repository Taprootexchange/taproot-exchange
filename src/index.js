import React from "react";
import ReactDOM from "react-dom/client";
import reportWebVitals from "./reportWebVitals";
import { ConfigProvider, notification, message } from "antd";
import "./styles/global.scss";
import { Provider } from "react-redux";
import store from "./store";
import { Router, RouterProvider } from "react-router-dom";
import router from "./App/Routes";
import { Provider as GraphProvider } from "urql";
import { Client, cacheExchange, fetchExchange } from "urql";

if (window.okxwallet) {
  window.nostr = window.okxwallet.nostr;
}

const GlobalModalInit = () => {
  const [api, contextHolder] = notification.useNotification();
  const [messageApi, messageContextHolder] = message.useMessage();
  if (api) {
    window.$notification = api;
  }
  if (messageApi) {
    window.$message = messageApi;
  }
  return (
    <>
      {contextHolder}
      {messageContextHolder}
    </>
  );
};

const client = Client({
  url: process.env.REACT_APP_API_GraphQL_URL,
  exchanges: [cacheExchange, fetchExchange],
  requestPolicy: "network-only",
});

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <ConfigProvider theme={{ token: { colorPrimary: "#5DBF69" } }}>
      <Provider store={store}>
        <GraphProvider value={client}>
          <RouterProvider router={router}></RouterProvider>
          <GlobalModalInit />
        </GraphProvider>
      </Provider>
    </ConfigProvider>
  </React.StrictMode>
);

reportWebVitals();
