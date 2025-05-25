export const msalConfig = {
    auth: {
      clientId: 'ff93bb52-a7a3-4c13-bd81-8a9ea2214c9a',
      authority: 'https://login.microsoftonline.com/d1935ada-3bbc-4cb9-aadb-3573476f35e1',
      redirectUri: 'http://localhost:3000/connections/api/auth/microsoft',
    },
    cache: {
      cacheLocation: 'localStorage', // 🔁 Persist between reloads
      storeAuthStateInCookie: false, // Set to true only for IE11
    },
  };
  
  export const loginRequest = {
    scopes: ['User.Read', 'Tasks.ReadWrite'],
  };