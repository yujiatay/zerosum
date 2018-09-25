import axios from 'axios'
import localForage from 'localforage'
import {client, persistor} from './apolloClient'

let token;

let LOGGED_IN = new CustomEvent("AUTH_STATE_CHANGED", {detail: true});
let LOGGED_OUT = new CustomEvent("AUTH_STATE_CHANGED", {detail: false});

// Returns a Promise that resolves if logging in is successful (i.e. token is stored)
// and rejects otherwise
export function loginWithFacebook(fbAccessToken, fbUserID) {
  return axios.post("http://api.zerosum.ml/login/facebook", {
    accessToken: fbAccessToken,
    userID: fbUserID
  }).then(r => {
    return localForage.setItem("token", r.data).then(() => {
      token = r.data;
      dispatchEvent(LOGGED_IN)
    }).then(() => {
      // Clear any prior cache
      return client.resetStore().then(() => persistor.resume()).catch((e) => {
        console.log("Error restarting cache: " + e)
      });
    })
  })
}

export function logout() {
  return localForage.removeItem("token").then(() => {
    token = null;
    dispatchEvent(LOGGED_OUT)
  }).then(() => {
    persistor.pause();
    return persistor.purge();
  });
}

export async function getToken() {
  if (token) {
    return token;
  } else {
    return await localForage.getItem("token").then((t) => {
      // Note: token could still be null here
      token = t;
      return t;
    }).catch((e) => {
      console.log(e);
      return null;
    })
  }
}

// Trigger on first load
getToken().then(() => {
  dispatchEvent(token ? LOGGED_IN : LOGGED_OUT)
});
