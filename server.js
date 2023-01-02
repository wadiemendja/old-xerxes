const express = require('express');
const { SQLdatabaseConnector, createDatabase, getRequests, saveRequest, getFilesStatus, searchFor, editFileStatus, deleteRequest } = require('./database/functions');
const path = require('path');
require('dotenv').config();
// connect to SQL database
SQLdatabaseConnector();
// create a database if !exist
createDatabase();
// express server setup
const app = express();
const PORT = process.env.SERVER_PORT;
app.listen(PORT, () => console.log(`Listening to localhost:${PORT}`));
// use express json & set limit to 50MB files
app.use(express.json({ limit: '50mb' }));
// Giving access to public files
app.use(express.static(__dirname + '/public'));
// Home page request
app.get('/', async (req, res) => {
        res.sendFile(path.join(__dirname, 'public/index.html'));
});
// Form page request
app.get('/add-request', (req, res) => {
        res.sendFile(path.join(__dirname, 'public/add-request.html'));
});
// Update existing form request
app.get('/update-request', (req, res) => {
        res.render('update_request');
});
// get requests for database & send them to the client
app.get('/api/get-requests', async (req, res) => {
        const data = await getRequests();
        res.send(data);
});
// save request in db
app.post('/api/save-request', async (req, res) => {
        const data = req.body;
        await saveRequest(data);
        console.log("data added successfully!")
});
// get status files status counts
app.get('/api/get-status-counts', async (req, res) => {
        const fileStatusCounters = await getFilesStatus();
        res.send(fileStatusCounters);
});
// seach for requsest
app.post('/api/search', async (req, res) => {
        const searchInput = req.body.searchInput;
        const results = await searchFor(searchInput);
        res.send(results);
});
// edit file status and description
app.post('/api/edit-file-status', async (req, res) => {
        const statut = req.body.statut;
        const description = req.body.description;
        const reqId = req.body.reqId;
        const done = await editFileStatus(statut, description, reqId);
        res.send(done);
});
// delete request
app.post('/api/delete-request', async (req, res) => {
        const reqId = req.body.reqId;
        const done = await deleteRequest(reqId);
        res.send(done);
});