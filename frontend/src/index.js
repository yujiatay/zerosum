import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import {ApolloProvider} from "react-apollo"
import {client, persistor} from "./utils/apolloClient"

persistor.restore().then(() => persistor.persist()).then(() => {
  ReactDOM.render(
    <ApolloProvider client={client}>
      <App/>
    </ApolloProvider>,
    document.getElementById('root'));
  registerServiceWorker();
});
