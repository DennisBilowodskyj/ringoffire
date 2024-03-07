import { initializeApp } from "firebase/app";
import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes), provideAnimationsAsync()]
};

const firebaseConfig = {
  apiKey: "AIzaSyBXB5-u3U67sg7xAugl-92ha5yiZ5_844E",
  authDomain: "ring-of-fire-7f7a7.firebaseapp.com",
  projectId: "ring-of-fire-7f7a7",
  storageBucket: "ring-of-fire-7f7a7.appspot.com",
  messagingSenderId: "747622262659",
  appId: "1:747622262659:web:475bfbc8f9f284b23eb8b6"
};

const app = initializeApp(firebaseConfig);
