import './bootstrap';
import 'preline';
import 'datatables.net-dt/js/dataTables.dataTables.min.mjs';
import React from 'react';
import ReactDOM from 'react-dom/client';
import Echo from 'laravel-echo';
import Layout from './components/Layout'
import Pusher from 'pusher-js';
import ForNow
 from './components/ForNow';
 import ClientLayout from './components/ClientLayout';
 import CaseLayout from './components/CaseLayout';

window.Pusher = Pusher;

window.Echo = new Echo({
    broadcaster: 'reverb',
    key: import.meta.env.VITE_REVERB_APP_KEY,
    wsHost: import.meta.env.VITE_REVERB_HOST,
    wsPort: import.meta.env.VITE_REVERB_PORT ?? 80,
    wssPort: import.meta.env.VITE_REVERB_PORT ?? 443,
    forceTLS: (import.meta.env.VITE_REVERB_SCHEME ?? 'https') === 'https',
    enabledTransports: ['ws', 'wss'],
});


window.Echo.channel('messages')
.listen('Message', (event)=>{
  console.log("j")
})
// import DatePicker from './components/DatePicker';

const rootElement = document.getElementById('table');
if(rootElement){
    ReactDOM.createRoot(document.getElementById('table')).render(
        <CaseLayout/>
    );
}


const fornow = document.getElementById('fornow');

if(fornow){
    const caseId = document.getElementById('fornow').getAttribute('data-case-id');
    ReactDOM.createRoot(document.getElementById('fornow')).render(
       <ForNow caseId={caseId}/>
   );
}

const clientsTable = document.getElementById('clientsTable');

if(clientsTable){
    ReactDOM.createRoot(document.getElementById('clientsTable')).render(
       <ClientLayout/>
   );
}

const layout = document.getElementById('layout');

if(layout){
    ReactDOM.createRoot(document.getElementById('layout')).render(
       <Layout/>
   );
}