import {HttpLink} from 'apollo-link-http'
import {setContext} from 'apollo-link-context'
import {ApolloLink} from 'apollo-link'
import ApolloClient from "apollo-client"
import {getToken} from "./auth";
import {InMemoryCache} from 'apollo-cache-inmemory'
import {CachePersistor} from 'apollo-cache-persist'
import localForage from 'localforage'

// "Middleware" to set auth token on header
const authMiddleware = setContext(async (_, {headers}) => {
  const token = await getToken();
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    }
  }
});

const link = ApolloLink.from([
  authMiddleware,
  new HttpLink({uri: 'http://api.zerosum.ml/noauth/gql'})
]);

const cache = new InMemoryCache();

export const client = new ApolloClient({
  link: link,
  cache: cache
});

export const persistor = new CachePersistor({
  cache,
  storage: localForage
});
