import axios from 'axios'

const VAPID_PUB_KEY = "BMXz5ZEhprGoI7vsIPkU9rYYt0gTrMFm_PlaztA2s5b36yiGc-VDYEykpLngVfyUoViASc0wl7ypBKFwruZk9E8";
const applicationServerKey = urlB64ToUint8Array(VAPID_PUB_KEY);

function urlB64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export let isSubscribed = undefined;

export function initPushStatus(swReg) {
  return swReg.pushManager.getSubscription().then(sub => {
    isSubscribed = !(sub === null);
    console.log("[Service Worker] " + (isSubscribed ? "Subscribed" : "Not subscribed") + " to push notifications")
  })
}
/**
 *
 * @param swReg
 * @param authToken
 * @returns {Promise<boolean | never>} true if success, false otherwise
 */
export function subscribeUser(swReg, authToken) {
  return swReg.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: applicationServerKey
  }).then(sub => updateSubscriptionOnServer(sub, authToken))
    .then(() => {
      console.log("User is subscribed to push notifications");
      isSubscribed = true;
      return true;
    }).catch(e => {
      console.log("Failed to subscribe user: ", e);
      return false;
    })
}

export function unsubscribeUser(swReg, authToken) {
  return swReg.pushManager.getSubscription()
    .then(sub => {
      if (sub) {
        return sub.unsubscribe()
      }
    }).then(() => updateSubscriptionOnServer(null, authToken))
    .then(() => {
      console.log("User is unsubscribed");
      isSubscribed = false;
      return true
    }).catch(e => {
      console.log("Error unsubscribing ", e);
      return false
    })
}

/**
 *
 * @param sub
 * @param authToken
 * @returns {AxiosPromise<any>} response to the backend call
 */
function updateSubscriptionOnServer(sub, authToken) {
  if (sub) {
    return axios.post("https://api.zerosum.ml/subscribe", sub, {
      headers: {Authorization: "Bearer " + authToken}
    })
  } else {
    return axios.post("https://api.zerosum.ml/unsubscribe", {
      headers: {Authorization: "Bearer " + authToken}
    })
  }
}
