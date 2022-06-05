// 1) Popup doesn't open on flyto
// 2) Does it make sense to have no scroll on the map at all, or should I enable scrolling on only the portion of the map containing the cards
// 3) Can I shrink the marker size to some default size when I zoom out (so that the large UCLA marker isn't misleading)

// declare variables
let mapOptions = { 'center': [34.0689, -118.4452], 'zoom': 5 };

let takesPrEP = L.featureGroup();
let doesNotTakePrEP = L.featureGroup();

// let layers = {
//     "On Campus PrEP Access": onCampus,
//     "Off Campus PrEP Access": offCampus
// };


// 1. get the map with ucla in focus
// 2. get the cards to show
// 3. chart triggers changes to map
// make UCLA marker larger the more responses there are (but only for non-PrEP users)

let circleOptions = {
    radius: 10,
    weight: 3,
    opacity: 1,
    fillOpacity: 0.2,
    color: "blue"
};

let noResponses = 0;

let circleOptionsUCLA = {
    radius: 10,
    weight: 3,
    opacity: 1,
    fillOpacity: 0.05,
    color: "red"
};

// keep track of values for chart
let takeprep = 0;
let lackprep = 0;

const dataUrl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSe3tKw51PzIC6dhUv5W8DEqg77o-usnZuTLBdgddFiD9rm3edq-Qa0pqJyOlSxnVtWEmR0YT--5Vmy/pub?output=csv";

const map = L.map('theMap', {scrollWheelZoom: false}).setView(mapOptions.center, mapOptions.zoom);

let Esri_WorldGrayCanvas = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}', {
    attribution: 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ',
    maxZoom: 16
});

Esri_WorldGrayCanvas.addTo(map);

// Figuring out chart by first adding  

function count(data) {
    if (data['Do you take PrEP (pre-exposure prophylaxis) right now?'] == "Yes") {
        takeprep += 1
    }
    else {
        lackprep += 1
    };
    return data
}

// add layer control box
// L.control.layers(null, layers).addTo(map);

// L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
//     attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
// }).addTo(map);

yesMarkers = []
noMarkers = []

function addMarker(data) {
    if (data['Do you take PrEP (pre-exposure prophylaxis) right now?'] == "Yes") {
        circleOptions.fillColor = "blue"
        marker = L.circleMarker([data.lat, data.lng], circleOptions).bindPopup(`<h2>` + data['address title'] + `</h2>`)
        takesPrEP.addLayer(marker);
        // createButtons(data.lat, data.lng, data['What address do you go to in order to access PrEP?'])
        yesMarkers.push(marker);
    }

    else {
        circleOptionsUCLA.fillColor = "red"
        circleOptionsUCLA.radius = 40 * noResponses;
        //console.log(noResponses)
        marker = L.circleMarker([34.0689, -118.4452], circleOptionsUCLA).bindPopup(`<h2>` + "UCLA" + `</h2>`)
        doesNotTakePrEP.addLayer(marker);
        noMarkers.push(marker)
    }

    // else if (data['Do you take PrEP (pre-exposure prophylaxis) right now?'] == "No") {
    //     createNonUserStory(data)
    //     //circleOptions.fillColor = "blue"
    //     //offCampus.addLayer(L.circleMarker([data.lat,data.lng],circleOptions).bindPopup(`<h2>Off Campus</h2>` + data['What address do you go to in order to access PrEP?']))
    //     //createButtons(data.lat,data.lng,data.Location)
    // }
    // if (data["Are you currently satisfied or not with accessibility to PrEP at UCLA, why or why not?"] != "") {
    //     createAccessStory(data)
    // }
    return count(data)
};

function createButtons(lat, lng, title) {
    const newButton = document.createElement("button"); // adds a new button
    newButton.id = "button" + title; // gives the button a unique id
    newButton.innerHTML = title; // gives the button a title
    newButton.setAttribute("lat", lat); // sets the latitude 
    newButton.setAttribute("lng", lng); // sets the longitude 
    newButton.addEventListener('click', function () {
        map.flyTo([lat, lng]); //this is the flyTo from Leaflet
    })
    const spaceForButtons = document.getElementById('placeForButtons')
    spaceForButtons.appendChild(newButton);//this adds the button to our page.
};

// function createNonUserStory(data) {
//     const newNonUserStory = document.createElement("nonUserStory");
//     newNonUserStory.id = "nonUserStory" + title;
//     newNonUserStory.innerHTML = `<b>Describe the factors that have led you to not take PrEP, including if you have never heard of it.</b><br>` + data["Describe the factors that have led you to not take PrEP, including if you have never heard of it."] + `<br><br>`;
//     const spaceForNonUserStories = document.getElementById('placeForNonUserStories')
//     spaceForNonUserStories.appendChild(newNonUserStory);//this adds the button to our page.
// }

// function createAccessStory(data) {
//     const newAccessStory = document.createElement("nonUserStory");
//     newAccessStory.id = "nonUserStory" + title;
//     newAccessStory.innerHTML = `<b>Are you currently satisfied or not with accessibility to PrEP at UCLA, why or why not?</b><br>` + data["Are you currently satisfied or not with accessibility to PrEP at UCLA, why or why not?"] + `<br><br>`;
//     const spaceFornewAccessStories = document.getElementById('placeForAccessStories')
//     spaceFornewAccessStories.appendChild(newAccessStory);//this adds the button to our page.
// }

function loadData(url) {
    Papa.parse(url, {
        header: true,
        download: true,
        complete: results => processData(results)
    })
};

function createCard(data, number) {
    const newCard = document.createElement("card");

    newCard.id = "card" + number;

    if (data["Do you take PrEP (pre-exposure prophylaxis) right now?"] == "Yes") {
        newCard.innerHTML = `<div class="card" style="cursor: pointer">

        <header class="card-header">
          <h1>Header</h1>
        </header>
        
        <div class="card-container">
          <p>` + data["Describe the factors that have encouraged you and/or made it more difficult for you to take PrEP."] + `</p>
        </div>
        
        <footer class="card-footer">
          <h5>Footer</h5>
        </footer>
        
        </div>`;
        newCard.setAttribute("lat", data.lat); // sets the latitude 
        newCard.setAttribute("lng", data.lng); // sets the longitude 
        newCard.addEventListener('click', function () {
        id = newCard.id.replace("card", "")
        console.log("id: " + id)
        map.flyTo([data.lat, data.lng]); //this is the flyTo from Leaflet
        console.log(yesMarkers[id])
        yesMarkers[id].openPopup();
        
    })
        const spaceForCards = document.getElementById('yes-stories')
        spaceForCards.appendChild(newCard);
    }
    else {
        newCard.innerHTML = `<div class="card">

        <header class="card-header">
          <h1>Header</h1>
        </header>
        
        <div class="card-container">
          <p>` + data["Describe the factors that have led you to not take PrEP, including if you have never heard of it."] + `</p>
        </div>
        
        <footer class="card-footer">
          <h5>Footer</h5>
        </footer>
        
        </div>`;
        const spaceForCards = document.getElementById('no-stories')
        spaceForCards.appendChild(newCard);
    }
}

function processData(results) {
    console.log(results)

    results.data.forEach(data => {
        if (data['Do you take PrEP (pre-exposure prophylaxis) right now?'] == "No")
        noResponses += 1;
    })

    let idNumber = 0;

    results.data.forEach(data => {
        console.log(data)
        addMarker(data)
        createCard(data, idNumber)
        idNumber += 1;
    })
    
    // for (let i = 0; i < results.data.length; i++) {
    //     console.log(results.data)
    //     addMarker(results.data)
    //     createCard(results.data, i)
    //   }
    // onCampus.addTo(map) // add our layers after markers have been made
    // offCampus.addTo(map) // add our layers after markers have been made  
    // let allLayers = L.featureGroup([onCampus, offCampus]);
    // map.fitBounds(allLayers.getBounds());
    addChart()
};

loadData(dataUrl)

// Load the chart

function addChart() {
    // create the new chart here, target the id in the html called "chart"
    chart = new Chart(document.getElementById("chart"), {
        type: 'pie', //can change to 'bar','line' chart or others
        data: {
            // labels for data here
            labels: ["Yes", "No"],
            datasets: [
                {
                    label: "Count",
                    backgroundColor: ["blue", "red"],
                    data: [takeprep, lackprep]
                }
            ]
        },
        options: {
            responsive: true, //turn on responsive mode changes with page size
            maintainAspectRatio: false, // if `true` causes weird layout issues
            legend: { display: true },
            title: {
                display: true,
                text: 'Do you take PrEP (pre-exposure prophylaxis) right now?'
            }
        }
    });
}

var canvas = document.getElementById("chart");
canvas.onclick = function (evt) {
    var activePoints = chart.getElementsAtEvent(evt);
    console.log(activePoints);
    if (activePoints[0]) {
        var chartData = activePoints[0]['_chart'].config.data;
        var idx = activePoints[0]['_index'];

        var label = chartData.labels[idx];
        var value = chartData.datasets[0].data[idx];
        console.log(label + " " + value);
        if (label == "Yes") {
            document.getElementById("no-stories").style.display = "none";
            document.getElementById("yes-stories").style.display = "block";
            map.invalidateSize();
            takesPrEP.addTo(map);
            map.fitBounds(takesPrEP.getBounds());
        }
        else if (label == "No") {
            document.getElementById("yes-stories").style.display = "none";
            document.getElementById("no-stories").style.display = "block";
            doesNotTakePrEP.addTo(map);
            map.fitBounds(doesNotTakePrEP.getBounds());
        }
    }
};