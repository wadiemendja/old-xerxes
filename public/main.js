import { renderHeader, renderFooter } from "./render.js";
// rendering header and footer
const header = document.getElementById('header');
const footer = document.getElementById('footer');
const tableBody = document.getElementById('table_body');
const noElements = document.getElementById('no_elements');
header.innerHTML = renderHeader();
footer.innerHTML = renderFooter();
// fetching requests data
let requests = await fetchRequests();
// empty requests list handeling
if (requests.length == 0) {
    noElements.innerHTML = `
        <img src="./img/no-elements.gif">
        <h2>Aucune demande n'est trouvée, ajoutez-en une pour pouvoir la voir ici<h2>
    `;
}
// rendering data (requests list)
function renderRequestsList() {
    let counter = 1;
    for (let i in requests.reverse()) {
        const person = requests[i];
        tableBody.innerHTML += `
        <tr data-description="${person.description}" data-pdf=${person.fichier}>
            <th scope="row" class="id" data-id="${person.id}">${counter}</th>
            <td class="nom">${person.nom}</td>
            <td class="prenom">${person.prenom}</td>
            <td class="email" data-email="${person.email}">${person.email.substring(0, 16)}...</td>
            <td class="telephone">${person.telephone}</td>
            <td class="wilaya">${person.wilaya}</td>
            <td class="daira">${person.daira}</td>
            <td class="commune">${person.commune}</td>
            <td class="domain">${person.domain}</td>
            <td class="service">${person.service}</td>
            <td class="date_depot">${person.date_depot}</td>
            <td class="duree_trait">${person.duree_trait}</td>
            <td class="statut" data-statut="${person.statut}">${renderStatusBox(person.statut)}</td>
        </tr>
        `;
        counter++;
    }
}
renderRequestsList();
// data previewer (listening to records click)
const previewer = document.getElementById('data_previewer');
const previewer_container = document.getElementById('preview_container');
function listenToPreviewClicks() {
    tableBody.querySelectorAll('tr').forEach(element => {
        element.addEventListener('click', (event) => {
            previewer.style.marginTop = window.scrollY + "px";
            previewer.style.visibility = "visible";
            const nom = element.querySelector('.nom').innerText;
            const prenom = element.querySelector('.prenom').innerText;
            const email = element.querySelector('.email').dataset.email;
            const telephone = element.querySelector('.telephone').innerText;
            const wilaya = element.querySelector('.wilaya').innerText;
            const daira = element.querySelector('.daira').innerText;
            const commune = element.querySelector('.commune').innerText;
            const domain = element.querySelector('.domain').innerText;
            const service = element.querySelector('.service').innerText;
            const date_depot = element.querySelector('.date_depot').innerText;
            const duree_trait = element.querySelector('.duree_trait').innerText;
            const description = element.dataset.description;
            const id = element.querySelector('.id').dataset.id;
            let statut = element.querySelector('.statut').dataset.statut;
            const fichier = element.dataset.pdf;
            previewer_container.innerHTML = `
                <p>
                    <strong>Modifier l'état de la demonde: </strong>
                    <select class="form-select" aria-label="Default select example" id="statutSelecter">
                        <option value="0" style="background:#FFCC00">En attendant</option>
                        <option value="-1" style="background:#FF0000">Rejeté</option>
                        <option value="1" style="background:#008000">Accepté</option>
                    </select>
                </p>
                <p><strong>Nom: </strong>${nom}</p>
                <p><strong>Prenom: </strong>${prenom}</p>
                <p><strong>Email: </strong>${email}</p>
                <p><strong>Telephone: </strong>${telephone}</p>
                <p><strong>Wilaya: </strong>${wilaya}</p>
                <p><strong>Daira: </strong>${daira}</p>
                <p><strong>Commune: </strong>${commune}</p>
                <p><strong>Domaine: </strong>${domain}</p>
                <p><strong>Service: </strong>${service}</p>
                <p><strong>Date de dépôt: </strong>${date_depot}</p>
                <p><strong>Durée de traitement: </strong>${duree_trait}</p>
                <p>
                    <strong>Description: </strong>
                    <textarea class="form-control" id="description" rows="3">${description}</textarea>
                </p>
                <iframe src="${fichier}"></iframe>
            `;
            // append buttons
            document.querySelector('.btns').innerHTML = `
                <button class="btn btn-outline-primary preview-btn" id="returnBtn">Retour</button>
                <button class="btn btn-outline-danger preview-btn" id="deleteBtn">Supprimer la demande</button>
                <button class="btn btn-outline-success preview-btn" id="saveBtn" disabled>Sauvegarder les modifications</button>
            `;
            // listening to changes
            const statutSelecter = document.getElementById('statutSelecter');
            statutSelecter.value = statut;
            statutSelecter.style.background = statutSelecter.querySelector(`[value="${statut}"]`).style.background;
            statutSelecter.addEventListener('change', () => {
                saveBtn.disabled = false;
                statut = statutSelecter.value;
                statutSelecter.style.background = statutSelecter.querySelector(`[value="${statut}"]`).style.background;
            });
            const previewDescription = document.getElementById('description');
            previewDescription.addEventListener('change', () => { saveBtn.disabled = false })
            // change request status and description
            const saveBtn = document.getElementById('saveBtn');
            saveBtn.addEventListener('click', async () => {
                returnBtn.click();
                await editFileStatus(statut, previewDescription.value, id);
                alert('Statut du fichier modifié avec succès.');
                location.href = "/";
            });
            // delete request
            const deleteBtn = document.getElementById('deleteBtn');
            deleteBtn.addEventListener('click', async () => {
                if (confirm('Etes-vous sûr de vouloir supprimer cette demode ?')) {
                    returnBtn.click();
                    await deleteRequest(id);
                    alert('Demonde supprimé avec succès.');
                    location.href = "/"
                }
            });
            // return from preview to home page
            const returnBtn = document.getElementById('returnBtn');
            returnBtn.addEventListener('click', () => { previewer.style.visibility = "hidden"; });
        });
    });
}
listenToPreviewClicks();
// check for updates (refresh list on adding or deleting a request)
const sound = new Audio('./sound/notification.webm');
const trigerSound = document.getElementById('trigerSound');
trigerSound.addEventListener('click', () => sound.play());
const rejectedCountDom = document.getElementById('rejectedCount');
const pendingCountDom = document.getElementById('pendingCount');
const acceptedCountDom = document.getElementById('acceptedCount');
let initStatusCounts = await fetchStatusCounts();
rejectedCountDom.innerText = initStatusCounts.rejectedFiles;
acceptedCountDom.innerText = initStatusCounts.acceptedFiles;
pendingCountDom.innerText = initStatusCounts.pendingFiles;
const checkForUpdates = setInterval(async () => {
    const currentStatusCounts = await fetchStatusCounts();
    if (JSON.stringify(currentStatusCounts) != JSON.stringify(initStatusCounts)) {
        rejectedCountDom.innerText = currentStatusCounts.rejectedFiles;
        acceptedCountDom.innerText = currentStatusCounts.acceptedFiles;
        pendingCountDom.innerText = currentStatusCounts.pendingFiles;
        tableBody.innerHTML = "";
        requests = await fetchRequests();
        initStatusCounts = currentStatusCounts;
        renderRequestsList();
        listenToPreviewClicks();
        trigerSound.click();
    }
}, 1000);
// seach by nom, prnom...
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const alertSearch = document.querySelector('.search-alert');
searchBtn.addEventListener('click', searchEvent);
document.getElementById('acceptedCount').addEventListener('click', searchEvent);
document.getElementById('pendingCount').addEventListener('click', searchEvent);
document.getElementById('rejectedCount').addEventListener('click', searchEvent);
// functions
async function searchEvent(event) {
    event.preventDefault();
    clearInterval(checkForUpdates);
    const input = event.target.tagName == 'BUTTON' ? searchInput.value : event.target.dataset.status;
    requests = await fetchSearch(input);
    tableBody.innerHTML = "";
    noElements.innerHTML = "";
    alertSearch.style.display = "";
    alertSearch.innerHTML = `
        <strong>${requests.length}</strong> recherche trouvée par "${input}", revenir à la liste d'origine <a href="/" style="color:red">(Home page)</a>
    `;
    if (requests.length == 0) {
        noElements.innerHTML = `
        <img src="./img/no-elements.gif">
        <h2>Aucune demande n'est trouvée, en recherchant <strong>"${input}"</strong><h2>
        `;
    }
    renderRequestsList();
    listenToPreviewClicks();
}
// fetching requests
async function fetchRequests() {
    const fetcher = await fetch('/api/get-requests');
    const requests = await fetcher.json();
    return requests;
}
// fetch files status counts
async function fetchStatusCounts() {
    const fetcher = await fetch('/api/get-status-counts');
    const statusCounts = await fetcher.json();
    return statusCounts;
}
// fetch search input if exist
async function fetchSearch(input) {
    const fetcher = await fetch('/api/search', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ searchInput: input })
    });
    const result = await fetcher.json();
    return result;
}
// render status box 
function renderStatusBox(status) {
    if (status == 1) return `<div style="border:1px solid #000000;width:10px;height:10px;background-color:#008000;margin:0 auto"></div>`;
    else if (status == 0) return `<div style="border:1px solid #000000;width:10px;height:10px;background-color:#FFCC00;margin:0 auto"></div>`;
    else return `<div style="border:1px solid #000000;width:10px;height:10px;background-color:#FF0000;margin:0 auto"></div>`;
}
// edit file status and description
async function editFileStatus(statut, description, reqId) {
    const fetcher = await fetch('/api/edit-file-status', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ statut: statut, description: description, reqId: reqId })
    });
    const result = await fetcher.text();
    return result;
}
// delete request
async function deleteRequest(reqId) {
    const fetcher = await fetch('/api/delete-request', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ reqId: reqId })
    });
    const result = await fetcher.text();
    return result;
}