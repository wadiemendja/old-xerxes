import { renderHeader, renderFooter } from './render.js';
// int header and footer
const header = document.getElementById('header');
const footer = document.getElementById('footer');
header.innerHTML = renderHeader();
footer.innerHTML = renderFooter();
// disabling search bar on this page
document.getElementById('searchBtn').disabled = true;
document.getElementById('searchInput').disabled = true;
// reading data file as base64 fromat 
const fileDom = document.getElementById('file');
let base64pdf = "";
fileDom.addEventListener('change', (event) => {
    const file = event.target.files[0];
    console.log(file);
    const fileReader = new FileReader();
    fileReader.readAsDataURL(file);
    fileReader.onload = () => {
        base64pdf = fileReader.result;
        const filePreviewer = document.getElementById('file_previewer');
        filePreviewer.style.display = "";
        filePreviewer.src = base64pdf;
    };
});
// valider button when click
document.getElementById('nom').value = "Mendja";
document.getElementById('prenom').value = "Wadie";
document.getElementById('email').value = "wadiemendja@gmail.com"
document.getElementById('telephone').value = "0672328144";
//document.getElementById('wilaya').value = "Bechar";
document.getElementById('daira').value = "IGLI";
document.getElementById('commune').value = "Igli";
document.getElementById('domain').value = "Informatique";
document.getElementById('service').value = "Industriel";
document.getElementById('date_depot').value = "25/02/2022";
document.getElementById('duree_trait').value = "4 jour";
document.getElementById('description').value = "simple description here";
const validerBtn = document.getElementById('valider');
let request = {};
validerBtn.addEventListener('click', () => {
    const nom = document.getElementById('nom').value;
    const prenom = document.getElementById('prenom').value;
    const email = document.getElementById('email').value;
    const telephone = document.getElementById('telephone').value;
    const wilayaSlector = document.getElementById('wilaya');
    const wilaya = wilayaSlector.options[wilayaSlector.selectedIndex].text;
    const daira = document.getElementById('daira').value;
    const commune = document.getElementById('commune').value;
    const domain = document.getElementById('domain').value;
    const service = document.getElementById('service').value;
    const date_depot = document.getElementById('date_depot').value;
    const duree_trait = document.getElementById('duree_trait').value;
    const description = document.getElementById('description').value;
    request = {
        nom: nom,
        prenom: prenom,
        email: email,
        telephone: telephone,
        wilaya: wilaya,
        daira: daira,
        commune: commune,
        domain: domain,
        service: service,
        date_depot: date_depot,
        duree_trait: duree_trait,
        description: description,
        fichier: base64pdf
    }
    fetch('/api/save-request', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(request)
    }).then(console.log('request fullfieled'));
    alert("Votre demande a été ajoutée à la base de données avec succès, retournez à la page d'accueil...");
    location.href = "/";
});

