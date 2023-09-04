const ticksName = "km/h"
let backgroundTod = [];
let backgroundTom = [];

const ctx = document.getElementById('chartTod');
const ctxTom = document.getElementById('chartTom');

let chartStatus1;
let chartStatus2;

function resetChart() {

  chartStatus1 = Chart.getChart("chartTod"); 
  if (chartStatus1 != undefined) {
  chartStatus1.destroy();
  }

  chartStatus2 = Chart.getChart("chartTom"); 
  if (chartStatus2 != undefined) {
  chartStatus2.destroy();
  }

}

let marker;

const fullTime = new Date();
const currentHour = fullTime.getHours();

const section1 = document.querySelector('#tiles');

const iconTile = document.getElementById("icon");
const tempTile = document.getElementById("temp");
const cloudCoversTile = document.getElementById("clouds");
const windTile = document.getElementById("wind");
const gustsTile = document.getElementById("gusts");
const precipitationTile = document.getElementById("precipitation");
const sunRiseTimeTile = document.getElementById("sunRiseTime");
const sunSetTimeTile = document.getElementById("sunSetTime");
const windDirectionTile = document.getElementById("windDirection");
const settingsTile = document.querySelector('#settings');
const kpIndexTile = document.querySelector('#kpIndex');
const legendTile = document.querySelector('#legend');

const Btn = document.getElementById("Btn");
const crdDefault = {latitude: 52.20, longitude: 21.00};

function success(pos) {
  const crd = pos.coords;
  // console.log(crd);

  transferPosition(crd);
}

function error(err) {
  console.warn(`ERROR(${err.code}): ${err.message}`);
  if(err.code === 1) {
    transferPosition(crdDefault);
  }
}

navigator.geolocation.getCurrentPosition(success, error);

function transferPosition(crd){
  const myLatitude = crd.latitude.toFixed(2);
  const myLongitude = crd.longitude.toFixed(2);

  forUrl(myLatitude,myLongitude)
}

function forUrl (lat,long) {

  // console.log(lat,long);

  let url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${long}&hourly=temperature_2m,precipitation_probability,weathercode,cloudcover,visibility,windspeed_10m,winddirection_10m,windgusts_10m&daily=sunrise,sunset&timezone=auto`

  const map = L.map('map').setView([lat, long], 10);

  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png?{foo}', {foo: 'bar', attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'}).addTo(map);

  L.marker([lat, long]).addTo(map);

  L.Control.geocoder().addTo(map);

  function onMapClick(e) {
    let lat = e.latlng.lat;
    let long = e.latlng.lng;
    let url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${long}&hourly=temperature_2m,precipitation_probability,weathercode,cloudcover,visibility,windspeed_10m,winddirection_10m,windgusts_10m&daily=sunrise,sunset&timezone=auto`;
    if (marker) {
      map.removeLayer(marker);
    }
    marker = L.marker([lat, long]).addTo(map);

    resetChart();
    
    backgroundTom = [];
    backgroundTod = [];
    getMeteoData(url);
  
}

map.on('click', onMapClick)

getMeteoData(url);

}

async function getMeteoData(url){
  
    const response = await fetch(url);
    const MeteoJsonData = await response.json();
    console.log(MeteoJsonData);

    const xLabels = Array.from(MeteoJsonData.hourly.time.slice(0,24));

    // arrays 

                    // today

    const yDataGustsTod = Array.from(MeteoJsonData.hourly.windgusts_10m.slice(0,24));
    const yDataWindTod = Array.from(MeteoJsonData.hourly.windspeed_10m.slice(0,24));
    const yDataTempTod = Array.from(MeteoJsonData.hourly.temperature_2m.slice(0,24));
    const yDataCloudCoverTod = Array.from(MeteoJsonData.hourly.cloudcover.slice(0,24));
    const yDataPrecipitationProbTod = Array.from(MeteoJsonData.hourly.precipitation_probability.slice(0,24));
    
                    // tomorrow
    
    const yDataGustsTom = Array.from(MeteoJsonData.hourly.windgusts_10m.slice(24,48));
    const yDataWindTom = Array.from(MeteoJsonData.hourly.windspeed_10m.slice(24,48));
    const yDataTempTom = Array.from(MeteoJsonData.hourly.temperature_2m.slice(24,48));
    const yDataCloudCoverTom = Array.from(MeteoJsonData.hourly.cloudcover.slice(24,48));
    const yDataPrecipitationProbTom = Array.from(MeteoJsonData.hourly.precipitation_probability.slice(24,48));
    

    // arrays (wind m/s)

                            // today

    const transferUnit1 = yDataGustsTod.map((value) => value * 1000 / 3600 );
    const yDataGustsTodMs = transferUnit1.map((value) => +value.toFixed(2));

    const transferUnit2 = yDataWindTod.map((value) => value * 1000 / 3600 )
    const yDataWindTodMs = transferUnit2.map((value) => +value.toFixed(2));

                           // tomorrow

    const transferUnit3 = yDataGustsTom.map((value) => value * 1000 / 3600 );                      
    const yDataGustsTomMs = transferUnit3.map((value) => +value.toFixed(2));

    const transferUnit4 = yDataWindTom.map((value) => value * 1000 / 3600 )
    const yDataWindTomMs = transferUnit4.map((value) => +value.toFixed(2));

    

    const onlyTime = xLabels.map((x) =>{
        return x.substring(11,13);
    })

    for(let i = 0; i<yDataGustsTod.length; i++ ) {
      if(yDataGustsTod[i] > 30){
        backgroundTod.push("red");
      }else{
        backgroundTod.push("blue");
      }
    }
   
    for(let i = 0; i<yDataGustsTom.length; i++ ) {
      if(yDataGustsTom[i] > 30){
        backgroundTom.push("red");
      }else{
        backgroundTom.push("blue");
      }
    }
  
    const currentWeatherCode = MeteoJsonData.hourly.weathercode[currentHour];

    let icon;
      switch (currentWeatherCode) {
        case 61:
          icon = '<i class="fa-solid fa-cloud-rain fa-xl"></i>';
          iconTile.classList.add('badConditions');
          break;

        case 63:
          icon = '<i class="fa-solid fa-cloud-rain fa-xl"></i>';
          iconTile.classList.add('badConditions');
          break;

        case 3:
          icon = '<i class="fa-solid fa-cloud fa-xl"></i>';
          iconTile.classList.remove('badConditions');
          break;

        case 2:
          icon = '<i class="fa-solid fa-cloud-sun fa-xl"></i>';
          iconTile.classList.remove('badConditions');
          break;

        case 1:
          icon = '<i class="fa-solid fa-cloud-sun fa-xl"></i>';
          iconTile.classList.remove('badConditions');
          break;
          break;

        case 0:
          icon = '<i class="fa-solid fa-sun fa-xl"></i>';
          iconTile.classList.remove('badConditions');
          break;

        case 71:
          icon = '<i class="fa-regular fa-snowflake fa-xl"></i>';
          iconTile.classList.add('badConditions');
          break;

        case 80:
          icon = '<i class="fa-solid fa-cloud-showers-heavy fa-xl"></i>';
          iconTile.classList.add('badConditions');
          break;

        case 81:
          icon = '<i class="fa-solid fa-cloud-showers-heavy fa-xl"></i>';
          iconTile.classList.add('badConditions');
          break;

        case 82:
          icon = '<i class="fa-solid fa-cloud-showers-heavy fa-xl"></i>';
          iconTile.classList.add('badConditions');
          break;

        case 85:
          icon = '<i class="fa-regular fa-snowflake fa-xl"></i>';
          iconTile.classList.add('badConditions');
          break;

        case 45:
          icon = '<i class="fa-solid fa-smog fa-xl"></i>';
          iconTile.classList.add('badConditions');
          break;

        case 48:
          icon = '<i class="fa-solid fa-icicles fa-xl"></i>';
          iconTile.classList.add('badConditions');
          break;

        case 53:
          icon = `<i class="fa-solid fa-umbrella fa-xl"></i>`;
          iconTile.classList.add('badConditions');
          break;
          
        case 51:
          icon = `<i class="fa-solid fa-umbrella fa-xl"></i>`;
          iconTile.classList.add('badConditions');
          break;

        case 77:
          icon = '<i class="fa-regular fa-snowflake fa-xl"></i>';
          iconTile.classList.add('badConditions');
          break;

        case 95:
          icon = '<i class="fa-solid fa-cloud-bolt fa-xl"></i>';
          iconTile.classList.add('badConditions');
          break;

        case 96:
          icon = '<i class="fa-solid fa-cloud-bolt fa-xl"></i>';
          iconTile.classList.add('badConditions');
          break;

        default:
          icon = "No value found";
      }

    const currentTemp = MeteoJsonData.hourly.temperature_2m[currentHour];
    const currentCloudCover = MeteoJsonData.hourly.cloudcover[currentHour];
    const currentWind = MeteoJsonData.hourly.windspeed_10m[currentHour];
    const currentGusts = MeteoJsonData.hourly.windgusts_10m[currentHour];
    const currentPrecipitation = MeteoJsonData.hourly.precipitation_probability[currentHour];
    const currentWindDirection = MeteoJsonData.hourly.winddirection_10m[currentHour];

    const currentWindMs = currentWind * 1000 / 3600;
    const finalCurrentWindMs = +currentWindMs.toFixed(2);

    const currentGustsMs = currentGusts * 1000 / 3600;
    const finalCurrentGustsMs = +currentGustsMs.toFixed(2);

    const sunRiseData = MeteoJsonData.daily.sunrise[0];
    const sunRiseTime = sunRiseData.substring(11);
    
    const sunSetData = MeteoJsonData.daily.sunset[0];
    const sunSetTime = sunSetData.substring(11);  

    tempTile.classList.toggle("badConditions", currentTemp < 0);
    gustsTile.classList.toggle("badConditions", currentGusts > 30);
    windTile.classList.toggle('badConditions', currentWind > 30);

    const btnCheckLegend = `<button id="checkLegend" class="chartBtn" type="submit">Sprawdź</button>`

    const startLegend = `<div>Historia<br>zmian:</div>${btnCheckLegend}`;
    
    legendTile.innerHTML = startLegend;

    const currentLegend = 
    `<i id="iconMark" class="fa-solid fa-xmark"></i>
    <ul>
    <li><b>ver.2.00</b></li>
    <li>Dodano obsługę wszystkich parametrów na wykresach</li>
    <li>Kontakt: o.tomek@wp.pl</li>
    </ul>`

    section1.addEventListener('click', showLegend);
    section1.addEventListener('click', closeLegend);
    section1.addEventListener('click', transferUnit);
    section1.addEventListener('click', createChartTemp);
    section1.addEventListener('click', createChartPrecipitaionClouds);
    section1.addEventListener('click', createChartWindGusts);

    function showLegend(e) {
    if (e.target.id === "checkLegend"){
    legendTile.innerHTML = currentLegend;
    legendTile.classList.toggle('active');
    }
   }

   function closeLegend(e) {
    if (e.target.id === "iconMark"){
      legendTile.innerHTML = startLegend;
      legendTile.classList.toggle('active');
      }
   }

    const buttonForChartTemp = '<button id="btnTurnOnChartTemp" class="chartBtn" type="submit">Wykres</button>'
    const buttonForChartClouds = '<button id="btnTurnOnChartClouds" class="chartBtn" type="submit">Wykres</button>'
    const buttonForChartWind = '<button id="btnTurnOnChartWind" class="chartBtn" type="submit">Wykres</button>'
    const buttonForChartGusts = '<button id="btnTurnOnChartGusts" class="chartBtn" type="submit">Wykres</button>'
    const buttonForChartPrecipitation = '<button id="btnTurnOnChartPrecipitation" class="chartBtn" type="submit">Wykres</button>'

    iconTile.innerHTML = icon;
    tempTile.innerHTML = `<div>Temperatura:</div><div><b>${currentTemp}°C</b></div>${buttonForChartTemp}`;
    cloudCoversTile.innerHTML = `<div>Zachmurzenie:</div><div><b>${currentCloudCover} %</b></div>${buttonForChartClouds}`;
    windTile.innerHTML = `<div>Wiatr:</div><div><b>${currentWind} km/h</b></div>${buttonForChartWind}`;
    gustsTile.innerHTML = `<div>Porywy:</div><div><b>${currentGusts} km/h</b></div>${buttonForChartGusts}`;
    precipitationTile.innerHTML = `<div>Prawd opadu:</div><div><b>${currentPrecipitation} %</b></div>${buttonForChartPrecipitation}`;
    sunRiseTimeTile.innerHTML = `<div>Wschód<br>słońca:</div><div><br><b>${sunRiseTime}</b></div>`;
    sunSetTimeTile.innerHTML = `<div>Zachód<br>słońca:</div><div><br><b>${sunSetTime}</b></div>`;

    const buttonsForSettings = 
    `<button id="kmH" type="submit">km/h</button>
    <button id="mS" type="submit">m/s</button>`
    
    settingsTile.innerHTML = `<div>Jednostki <br> dla wiatru:</div><div>${buttonsForSettings}</div>`;
  
    const btnTurnOnChartTemp = document.querySelector("#btnTurnOnChartTemp");
    const btnTurnOnChartClouds = document.querySelector('#btnTurnOnChartClouds');
    const btnTurnOnChartPrecipitation = document.querySelector('#btnTurnOnChartPrecipitation');

    
    function createStartChart() {

      creatChart(ctx, onlyTime,'Prędkość wiatru - km/h', yDataWindTod, 'green', 'Porywy wiatru - km/h', yDataGustsTod, backgroundTod, 'Dziś (24h)', true, 'km/h');
      creatChart(ctxTom, onlyTime,'Prędkość wiatru - km/h', yDataWindTom, 'green', 'Porywy wiatru - km/h', yDataGustsTom, backgroundTom,'Jutro (24h)', false, 'km/h');
      
      document.querySelector('#kmH').classList.add('clicked');  

      document.querySelector('#btnTurnOnChartWind').classList.add('clicked');
      document.querySelector('#btnTurnOnChartGusts').classList.add('clicked');

      }
    
      createStartChart();
    
    function createChartTemp(e) {
      if (e.target.id === 'btnTurnOnChartTemp'){
        resetChart();

        creatChart(ctx, onlyTime,'Temperatura - °C', yDataTempTod, 'blue', '', undefined, undefined, 'Dziś (24h)', true, '°C');
        creatChart(ctxTom, onlyTime,'Temperatura - °C', yDataTempTom, 'blue', '', undefined, undefined,'Jutro (24h)', false, '°C');
        
        btnTurnOnChartTemp.classList.add('clicked');
        
        document.querySelector('#btnTurnOnChartWind').classList.remove('clicked');
        document.querySelector('#btnTurnOnChartGusts').classList.remove('clicked');

        btnTurnOnChartPrecipitation.classList.remove('clicked');
        btnTurnOnChartClouds.classList.remove('clicked');
        
        document.querySelector('#kmH').classList.remove('clicked');
        document.querySelector('#mS').classList.remove('clicked');
      }
      
    }

    function createChartPrecipitaionClouds(e) {
      if (e.target.id === 'btnTurnOnChartClouds' || e.target.id === 'btnTurnOnChartPrecipitation'){
        resetChart();
        creatChart(ctx, onlyTime,'Prawdopodobieństwo opadów - %', yDataPrecipitationProbTod, 'blue', 'Zachmurzenia - %', yDataCloudCoverTod, 'green', 'Dziś (24h)', true, '%');
        creatChart(ctxTom, onlyTime,'Prawdopodobieństwo opadów - %', yDataPrecipitationProbTom, 'blue', 'Zachmurzenie - %', yDataCloudCoverTom, 'green','Jutro (24h)', false, '%');
        
        btnTurnOnChartClouds.classList.add('clicked');
        btnTurnOnChartPrecipitation.classList.add('clicked');

        document.querySelector('#btnTurnOnChartWind').classList.remove('clicked');
        document.querySelector('#btnTurnOnChartGusts').classList.remove('clicked');

        btnTurnOnChartTemp.classList.remove('clicked');
        document.querySelector('#kmH').classList.remove('clicked');
        document.querySelector('#mS').classList.remove('clicked');
      }

    }

    function createChartWindGusts(e) {
      if (e.target.id === 'btnTurnOnChartWind' || e.target.id === 'btnTurnOnChartGusts'){
        
        resetChart();
        createStartChart();

        btnTurnOnChartClouds.classList.remove('clicked');
        btnTurnOnChartPrecipitation.classList.remove('clicked');
        btnTurnOnChartTemp.classList.remove('clicked');

      }

    }

    function transferUnit(e) {
      if(e.target.id === 'mS') {
  
        windTile.innerHTML = `<div>Wiatr:</div><div><b>${finalCurrentWindMs} m/s</b></div>${buttonForChartWind}`;
        gustsTile.innerHTML = `<div>Porywy:</div><div><b>${finalCurrentGustsMs} m/s</b></div>${buttonForChartGusts}`;

        resetChart();

        creatChart(ctx, onlyTime,'Prędkość wiatru - m/s', yDataWindTodMs, 'green', 'Porywy wiatru - m/s', yDataGustsTodMs, backgroundTod, 'Dziś (24h)', true,  'm/s');
        creatChart(ctxTom, onlyTime,'Prędkość wiatru - m/s', yDataWindTomMs, 'green', 'Porywy wiatru - m/s', yDataGustsTomMs, backgroundTom,'Jutro (24h)', false, 'm/s');

        document.querySelector('#kmH').classList.remove('clicked');
        document.querySelector('#mS').classList.add('clicked');

        document.querySelector('#btnTurnOnChartWind').classList.add('clicked');
        document.querySelector('#btnTurnOnChartGusts').classList.add('clicked');

        btnTurnOnChartClouds.classList.remove('clicked');
        btnTurnOnChartPrecipitation.classList.remove('clicked');
        btnTurnOnChartTemp.classList.remove('clicked');

      }

      if(e.target.id === 'kmH') {

        windTile.innerHTML = `<div>Wiatr:</div><div><b>${currentWind} km/h</b></div>${buttonForChartWind}`;
        gustsTile.innerHTML = `<div>Porywy:</div><div><b>${currentGusts} km/h</b></div>${buttonForChartGusts}`;

        document.querySelector('#kmH').classList.add('clicked');
        document.querySelector('#mS').classList.remove('clicked');

        btnTurnOnChartClouds.classList.remove('clicked');
        btnTurnOnChartPrecipitation.classList.remove('clicked');
        btnTurnOnChartTemp.classList.remove('clicked');
        
        resetChart();
        createStartChart();
        
      }
    }

    async function getKpIndex () {
      const KP_URL = 'https://services.swpc.noaa.gov/products/noaa-planetary-k-index.json';
      
      const response = await fetch(KP_URL);
      const KpJson = await response.json();

      transferKp(KpJson);
   }
  
   getKpIndex();
  
    function transferKp(Kp) {
    const lastIndex = Kp.length -1;
    const KP = +Kp[lastIndex][1];
  
    kpIndexTile.innerHTML = `<div>Kp:</div><div><br><b>${KP}</b></div>`;
    kpIndexTile.classList.toggle('badConditions', KP > 4);
  }
  
    const degToCard = function(deg){
      if (deg>11.25 && deg<=33.75){
        return "NNE";
      }else if (deg>33.75 && deg<=56.25){
        return "ENE";
      }else if (deg>56.25 && deg<=78.75){
        return "E";
      }else if (deg>78.75 && deg<=101.25){
        return "ESE";
      }else if (deg>101.25 && deg<=123.75){
        return "ESE";
      }else if (deg>123.75 && deg<=146.25){
        return "SE";
      }else if (deg>146.25 && deg<=168.75){
        return "SSE";
      }else if (deg>168.75 && deg<=191.25){
        return "S";
      }else if (deg>191.25 && deg<=213.75){
        return "SSW";
      }else if (deg>213.75 && deg<=236.25){
        return "SW";
      }else if (deg>236.25 && deg<=258.75){
        return "WSW";
      }else if (deg>258.75 && deg<=281.25){
        return "W";
      }else if (deg>281.25 && deg<=303.75){
        return "WNW";
      }else if (deg>303.75 && deg<=326.25){
        return "NW";
      }else if (deg>326.25 && deg<=348.75){
        return "NNW";
      }else{
        return "N"; 
      }
    }

    let nameOfWindDirection = degToCard(currentWindDirection);
    
    windDirectionTile.innerHTML = `<div>Kierunek<br>wiatru:</div><div><br><b>${nameOfWindDirection}</b></div>`

    function creatChart(ctx, xAxis, textForLabel1, yAxis1, color1, textForLabel2, yAxis2, color2, day, flag, unit) {

      const chart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: xAxis,
          datasets: [{
            label: textForLabel1,
            data: yAxis1,
            // borderWidth: 1,
            borderColor: color1,
          },
          {
            label: textForLabel2,
            data: yAxis2,
            // borderWidth: 1,
            borderColor: color2,
          }]
        },
        options: {
          maintainAspectRatio: false,
          plugins:{
            title: {
              display: true,
              text: day, //"Dziś (24h)"
              color: "black",
            },
          },
          scales: {
            x:{
              grid:{
              
                  color: (ctx) => {
                    if(flag) {
                      if(ctx.tick.value === currentHour){
                      return "red"
                   }
                  }
                }
                
              },
              ticks: {
                color: "black",
                autoSkip: false,
              }
            },
            y: {
              beginAtZero: true,
              ticks:{
                callback: function numeric(t,e,i) {
                  return `${t} ${unit}`
                },
                color: "black"
              } 
            }
          }
        }
      })

    }  
 
}
