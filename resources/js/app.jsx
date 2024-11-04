import './bootstrap';
import 'preline';
import 'datatables.net-dt/js/dataTables.dataTables.min.mjs';
import React from 'react';
import ReactDOM from 'react-dom/client';
import Table from './components/Table';
import WorkSpace from './components/WorkSpace'
import TodoList from './components/TodoList';
import PendingCases from './components/main/PendingCases';
import ClientTable from './components/main/clients/ClientsTable';
import Echo from 'laravel-echo';

import Pusher from 'pusher-js';
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

window.Echo.private('messages')
.listen('Message', (event)=>{
  console.log(event)
})
// import DatePicker from './components/DatePicker';

const rootElement = document.getElementById('table');
if(rootElement){
    ReactDOM.createRoot(document.getElementById('table')).render(
        <Table/>
    );
}

const rootElementOne = document.getElementById('workspace');

if(rootElementOne){
    const caseId = document.getElementById('workspace').getAttribute('data-case-id');

    ReactDOM.createRoot(document.getElementById('workspace')).render(
       <WorkSpace caseId={caseId}/>
   );
}

const todoList = document.getElementById('todoList');

if(todoList){
    ReactDOM.createRoot(document.getElementById('todoList')).render(
       <TodoList/>
   );
}

const pendingCases = document.getElementById('pendindCases');

if(todoList){
    ReactDOM.createRoot(document.getElementById('pendindCases')).render(
       <PendingCases/>
   );
}

const clientsTable = document.getElementById('clientsTable');

if(clientsTable){
    ReactDOM.createRoot(document.getElementById('clientsTable')).render(
       <ClientTable/>
   );
}