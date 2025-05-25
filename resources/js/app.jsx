// import './bootstrap';

import { createInertiaApp } from '@inertiajs/react'
import { createRoot } from 'react-dom/client';
import { ThemeProvider } from './ThemeProvider';
import { I18nextProvider } from "react-i18next";
import i18n from "./i18next";
import { GoogleOAuthProvider } from '@react-oauth/google'
import { PublicClientApplication } from "@azure/msal-browser";
import { MsalProvider } from "@azure/msal-react";
import { msalConfig } from "./authConfigMicrosoft";

// const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

const msalInstance = new PublicClientApplication(msalConfig);

 createInertiaApp({
   resolve: name => {
     const pages = import.meta.glob('./Pages/**/*.jsx', { eager: true })
     return pages[`./Pages/${name}.jsx`]
   },
   setup({ el, App, props }) {
     createRoot(el).render(
      <MsalProvider instance={msalInstance}>
      <I18nextProvider i18n={i18n}>
        <ThemeProvider>  {/* Wrap everything in ThemeProvider */}
            <App {...props} />
        </ThemeProvider>
      </I18nextProvider>
      </MsalProvider>
    )
   },
 })


