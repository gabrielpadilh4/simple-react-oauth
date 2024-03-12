import React from 'react'
import ReactDOM from 'react-dom/client'
import Keycloak from "keycloak-js"

var initOptions = {
  url: 'http://0.0.0.0:8080', 
  realm: 'simple', 
  clientId: 'react-frontend', 
  onLoad: 'login-required'
}

const keycloak = new Keycloak(initOptions);

keycloak.init({ onLoad: initOptions.onLoad }).then((auth) => {

  if (!auth) {
    window.location.reload();
  }


  ReactDOM.createRoot(document.getElementById('root')).render(
    <h1>Authenticated!</h1>,
  )

localStorage.setItem("react-token", keycloak.token);
localStorage.setItem("react-refresh-token", keycloak.refreshToken);

setTimeout(() => {

    keycloak.updateToken(70).then((refreshed) => {
        if (refreshed) {
            console.debug('Token refreshed' + refreshed);
        } else {
            console.warn('Token not refreshed, valid for '
                + Math.round(keycloak.tokenParsed.exp + keycloak.timeSkew - new Date().getTime() / 1000) + ' seconds');
        }
    }).catch(() => {
        console.error('Failed to refresh token');
    });


}, 60000)

}).catch((error) => {
  console.error(error);
});
