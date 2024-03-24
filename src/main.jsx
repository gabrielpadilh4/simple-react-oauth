import React from 'react'
import ReactDOM from 'react-dom/client'
import Keycloak from "keycloak-js"

var initOptions = {
  url: 'http://0.0.0.0:8080', 
  realm: 'simple', 
  clientId: 'react-frontend', 
  onLoad: 'login-required',
  scope: 'offline_access'
}

const keycloak = new Keycloak(initOptions);

keycloak.init({ onLoad: initOptions.onLoad, scope: initOptions.scope }).then((auth) => {

  if (!auth) {
    window.location.reload();
  }


  ReactDOM.createRoot(document.getElementById('root')).render(
    <div>
      <div>
        <p>Refresh Token</p>
        <pre>{JSON.stringify(keycloak.refreshTokenParsed, null, 2)} </pre>
        <p>RAW refresh token</p>
        <div>{keycloak.refreshToken} </div>
      </div>
      <div>
        <p>ID Token</p>
        <pre>{JSON.stringify(keycloak.idTokenParsed, null, 2)} </pre>
      </div>
      <div>
        <p>Access Token</p>
        <pre>{JSON.stringify(keycloak.tokenParsed, null, 2)} </pre>
      </div>
    </div>
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
