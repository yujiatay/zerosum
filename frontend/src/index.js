import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import ApolloClient from "apollo-boost"
import {ApolloProvider} from "react-apollo"

const defaults = {
};
const client = new ApolloClient({
  clientState: {
    defaults: defaults
  }
}); //TODO: Set uri

ReactDOM.render(
  <ApolloProvider client={client}>
    <App/>
  </ApolloProvider>,
  document.getElementById('root'));
registerServiceWorker();
