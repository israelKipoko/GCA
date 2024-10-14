import './bootstrap';
import 'preline';
import 'datatables.net-dt/js/dataTables.dataTables.min.mjs';
import React from 'react';
import ReactDOM from 'react-dom/client';
import Table from './components/Table';
import WorkSpace from './components/WorkSpace'

// import DatePicker from './components/DatePicker';

const rootElement = document.getElementById('table');
if(rootElement){
    ReactDOM.createRoot(document.getElementById('table')).render(
        <Table/>
    );
}

const caseId = document.getElementById('workspace').getAttribute('data-case-id');

 ReactDOM.createRoot(document.getElementById('workspace')).render(
    <WorkSpace caseId={caseId}/>
);