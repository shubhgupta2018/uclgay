// declare variables
let mapOptions = {'center': [34.0689,-118.4452],'zoom':5};

let onCampus = L.featureGroup();
let offCampus = L.featureGroup();

let layers = {
    "On Campus PrEP Access": onCampus,
    "Off Campus PrEP Access": offCampus
};

let circleOptions = {
    radius: 4,
    fillColor: "#ff7800",
    color: "#000",
    weight: 1,
    opacity: 1,
    fillOpacity: 0.8
};

const dataUrl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSe3tKw51PzIC6dhUv5W8DEqg77o-usnZuTLBdgddFiD9rm3edq-Qa0pqJyOlSxnVtWEmR0YT--5Vmy/pub?output=csv";

const map = L.map('theMap').setView(mapOptions.center, mapOptions.zoom);

let Esri_WorldGrayCanvas = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}', {
    attribution: 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ',
    maxZoom: 16
});

Esri_WorldGrayCanvas.addTo(map);

// add layer control box
L.control.layers(null,layers).addTo(map);

// L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
//     attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
// }).addTo(map);

function addMarker(data){
    if(data['Do you take PrEP (pre-exposure prophylaxis) right now?'] == "Yes"){
        circleOptions.fillColor = "red"
        onCampus.addLayer(L.circleMarker([data.lat,data.lng],circleOptions).bindPopup(`<h2>On Campus</h2>` + data['What address do you go to in order to access PrEP?']))
        createButtons(data.lat,data.lng,data['What address do you go to in order to access PrEP?'])
        }

    else if(data['Do you take PrEP (pre-exposure prophylaxis) right now?'] == "No"){
        createNonUserStory(data)
        //circleOptions.fillColor = "blue"
        //offCampus.addLayer(L.circleMarker([data.lat,data.lng],circleOptions).bindPopup(`<h2>Off Campus</h2>` + data['What address do you go to in order to access PrEP?']))
        //createButtons(data.lat,data.lng,data.Location)
    }
    if(data["Are you currently satisfied or not with accessibility to PrEP at UCLA, why or why not?"] != "") {
        createAccessStory(data)
    }  
    return data
};

function createButtons(lat,lng,title){
    const newButton = document.createElement("button"); // adds a new button
    newButton.id = "button"+title; // gives the button a unique id
    newButton.innerHTML = title; // gives the button a title
    newButton.setAttribute("lat",lat); // sets the latitude 
    newButton.setAttribute("lng",lng); // sets the longitude 
    newButton.addEventListener('click', function(){
        map.flyTo([lat,lng]); //this is the flyTo from Leaflet
    })
    const spaceForButtons = document.getElementById('placeForButtons')
    spaceForButtons.appendChild(newButton);//this adds the button to our page.
};

function createNonUserStory(data) {
    const newNonUserStory = document.createElement("nonUserStory");
    newNonUserStory.id = "nonUserStory"+title;
    newNonUserStory.innerHTML = `<b>Describe the factors that have led you to not take PrEP, including if you have never heard of it.</b><br>` + data["Describe the factors that have led you to not take PrEP, including if you have never heard of it."]  + `<br><br>`;
    const spaceForNonUserStories = document.getElementById('placeForNonUserStories')
    spaceForNonUserStories.appendChild(newNonUserStory);//this adds the button to our page.
}

function createAccessStory(data) {
    const newAccessStory = document.createElement("nonUserStory");
    newAccessStory.id = "nonUserStory"+title;
    newAccessStory.innerHTML = `<b>Are you currently satisfied or not with accessibility to PrEP at UCLA, why or why not?</b><br>` + data["Are you currently satisfied or not with accessibility to PrEP at UCLA, why or why not?"] + `<br><br>`;
    const spaceFornewAccessStories = document.getElementById('placeForAccessStories')
    spaceFornewAccessStories.appendChild(newAccessStory);//this adds the button to our page.
}

function loadData(url){
    Papa.parse(url, {
        header: true,
        download: true,
        complete: results => processData(results)
    })
};

function processData(results){
    console.log(results)
    results.data.forEach(data => {
        console.log(data)
        addMarker(data)
    })
    onCampus.addTo(map) // add our layers after markers have been made
    offCampus.addTo(map) // add our layers after markers have been made  
    let allLayers = L.featureGroup([onCampus,offCampus]);
    map.fitBounds(allLayers.getBounds());
};

loadData(dataUrl)
