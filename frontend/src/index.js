import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import {ApolloProvider} from "react-apollo"
import {client, persistor} from "./utils/apolloClient"
import localForage from "localforage"

localForage.config({
  name: "zerosum",
  storeName: "zerosum_store"
});

let pushSupported = false;
if ("serviceWorker" in navigator && "PushManager" in window) {
  console.log("[Service Worker] Push notifications supported");
  pushSupported = true;
}

registerServiceWorker();

persistor.purge().then(() => {
  ReactDOM.render(
    <ApolloProvider client={client}>
      <App pushSupported={pushSupported}/>
    </ApolloProvider>,
    document.getElementById('root'));
});


