import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import {ApolloProvider} from "react-apollo"
import {client, persistor} from "./utils/apolloClient"
import localForage from "localforage"
import {isSubscribed, initPushStatus, subscribeUser} from "./utils/pushNotifications";
import {getToken} from "./utils/auth";

localForage.config({
  name: "zerosum",
  storeName: "zerosum_store"
});

registerServiceWorker();
// persistor.restore().then(() => persistor.persist()).then(() => {
persistor.purge().then(() => {
  ReactDOM.render(
    <ApolloProvider client={client}>
      <App/>
    </ApolloProvider>,
    document.getElementById('root'));
});

// Register push notifs, if supported
if ("serviceWorker" in navigator && "PushManager" in window) {
  console.log("[Service Worker] Push notifications supported");
  navigator.serviceWorker.ready.then(swReg => {
    console.log("[Service Worker] Ready");
    return initPushStatus(swReg).then(() => {
      if (!isSubscribed) {
        return getToken().then(t => {
          if (t) {
            return subscribeUser(swReg, t)
          }
        })
      }
    })
  })
}
