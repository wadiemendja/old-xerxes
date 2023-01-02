const mysql = require('mysql');
require('dotenv').config();
const env = process.env;
// Database config
const con = mysql.createConnection({
    host: env.DB_HOST,
    port: env.DB_PORT,
    user: env.DB_USER,
    password: env.DB_PASS
});
// database connector
function SQLdatabaseConnector() {
    con.connect((err) => {
        if (err) console.log(err);
        else console.log('Connected to the database!');
    });
}
// database creator
function createDatabase() {
    con.query('create database xx', (err, result) => { console.log(result) });
    con.query('use xx', (err, result) => { console.log(result) });
    con.query("create table requests (id int auto_increment primary key, nom varchar(20), prenom varchar(20), email varchar(40), telephone varchar(10), wilaya varchar(20), daira varchar(20), commune varchar(40), domain varchar(50), service varchar(40), date_depot varchar(20), duree_trait varchar(20), description varchar(255), statut varchar(2), fichier longtext)"
        , (err, result) => { console.log(result) });
}
// retrieve data 
async function getRequests() {
    let data = undefined;
    const promise = new Promise((resolve, reject) => {
        con.query('select * from requests', (err, result) => { data = result; resolve(); });
    })
    await promise;
    return data;
}
// store requests in db
async function saveRequest(data) {
    const promise = new Promise((resolve, reject) => {
        con.query(`insert into requests (nom, prenom, email, telephone, wilaya, daira, commune, domain, service, date_depot, duree_trait, description, statut, fichier) values ("${data.nom}", "${data.prenom}", "${data.email}", "${data.telephone}", "${data.wilaya}", "${data.daira}", "${data.commune}", "${data.domain}", "${data.service}", "${data.date_depot}", "${data.duree_trait}", "${data.description}", "0", "${data.fichier}")`,
            (err, result) => {
                if (err) console.log(err);
                else resolve();
            });
    })
    await promise;
}
// get files status counters 
async function getFilesStatus() {
    let rejectedFiles = 0; let acceptedFiles = 0; let pendingFiles = 0;
    const promise = new Promise((resolve, reject) => {
        con.query('select count(*) from requests where statut="-1"', (err, result) => { rejectedFiles = result; });
        con.query('select count(*) from requests where statut="1"', (err, result) => { acceptedFiles = result; });
        con.query('select count(*) from requests where statut="0"', (err, result) => { pendingFiles = result; resolve(); });
    })
    await promise;
    return {
        acceptedFiles: acceptedFiles[0]['count(*)'],
        rejectedFiles: rejectedFiles[0]['count(*)'],
        pendingFiles: pendingFiles[0]['count(*)']
    };
}
// search sql query
async function searchFor(searchInput) {
    let results = undefined;
    const promise = new Promise((resolve, reject) => {
        con.query(`select * from requests where nom="${searchInput}" or prenom="${searchInput}" or wilaya="${searchInput}" or telephone="${searchInput}" or statut="${searchInput}"`, (err, result) => { results = result; resolve(); });
    });
    await promise;
    return results;
}
// editing request status and description
async function editFileStatus(statut, description, reqId) {
    const promise = new Promise((resolve, reject) => {
        con.query(`update requests set statut="${statut}", description="${description}" where id=${reqId}`, (err, result) => { resolve(); });
    });
    await promise;
    return true;
}
// delete request sql query
async function deleteRequest(reqId) {
    const promise = new Promise((resolve, reject) => {
        con.query(`delete from requests where id=${reqId}`, (err, result) => { results = result; resolve(); });
    });
    await promise;
    return true;
}

module.exports = { SQLdatabaseConnector, createDatabase, getRequests, saveRequest, getFilesStatus, searchFor, editFileStatus, deleteRequest };