import axios from 'axios'
import localForage from 'localforage'
import {client, persistor} from './apolloClient'

let token;

// Returns a Promise that resolves if logging in is successful (i.e. token is stored)
// and rejects otherwise
export function loginWithFacebook(fbAccessToken, fbUserID, loginSuccessCallback) {
  return axios.post("https://api.zerosum.ml/login/facebook", {
    accessToken: fbAccessToken,
    userID: fbUserID
  }).then(r => {
    return localForage.setItem("token", r.data.token).then(() => {
      token = r.data.token;
      console.log(r.data.newUser);
      loginSuccessCallback(r.data.newUser)
    }).then(() => {
      // Clear any prior cache
      return client.resetStore().then(() => persistor.resume()).catch((e) => {
        console.log("Error restarting cache: " + e)
      });
    })
  })
}

export function logout(logoutSuccessCallback) {
  return localForage.removeItem("token").then(() => {
    token = null;
    logoutSuccessCallback()
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
      console.log("[Auth] error " + e);
      return null;
    })
  }
}

