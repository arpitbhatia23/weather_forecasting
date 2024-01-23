document.addEventListener('DOMContentLoaded', function() {
    // Your code here
const container = document.querySelector('.container');
const search = document.querySelector('.search-box button');
const weatherbox = document.querySelector('.weather-box');
const weatherdetails = document.querySelector('.weather-details');
const error404 = document.querySelector('.not-found'); // Fix: Added missing error404 variable
const locationElement=document.querySelector('#location');
const dateElement=document.querySelector('.date');
const cityElement = document.querySelector('.city');
const sunriseElement = document.querySelector('.sunrise');
const sunsetElement = document.querySelector('.sunset');
const seaLevelElement = document.querySelector('.sea-level');
const groundLevelElement = document.querySelector('.ground-level');
const airPurityElement = document.querySelector('.air-purity');
const hourlyList = document.querySelector('.hourly-list');
const weeklylist = document.getElementById('weeklylist');
window.addEventListener('load', async () => {
    try{
        updatelLocation();
        updateDateTime();
        const currentLocationWeather=await getCurrentLocationWeather();
        handleWeatherData(currentLocationWeather);
        setInterval(updateDateTime, 1000);
    }
catch(error){
    console.error('error fetching data', error);
    handleNotFound();
}
});

search.addEventListener('click', async () => {
    const APIKEY = 'e38b8adced5269e5111dc584c110097a';
    const city = document.querySelector('.search-box input').value; // Fix: Changed "Value" to "value"

    if (city === '' ) return;
    

    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${APIKEY}`);
        console.log('after fetch');

         const json = await response.json();

        if (json.cod === '404') {
            handleNotFound();
        } else {
            handleWeatherData(json);
        
        }
    } catch (error) {
        console.error('error fetching data :',error);
        handleNotFound();
    }
    audioElement.play();

});

function handleNotFound() {
    weatherbox.classList.remove('active');
    weatherdetails.classList.remove('active');
    error404.classList.add('active');
    locationElement.textContent='';
}
async function getCurrentLocationWeather() {
    const APIKEY = 'e38b8adced5269e5111dc584c110097a';

    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(async function (position) {
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;
            const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${APIKEY}`);
            const json = await response.json();
            resolve(json);
        }, reject);
    });
}
function getWeatherData(latitude, longitude) {
    fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&units=metric&exclude=current,minutely,daily,alerts&appid=e38b8adced5269e5111dc584c110097a`)
    .then(response => response.json())
       .then(data => {
         displayCurrentWeather(data.current);
         displayNext5DaysWeather(data.daily);
       });
   }

   /* hourly forecast*/
   window.addEventListener('load', async () => {
    try {
        await updateLocationAndWeather();
    } catch (error) {
        console.error('Error fetching data:', error);
        handleNotFound();
    }
});

search.addEventListener('click', async () => {
    const APIKEY = 'e38b8adced5269e5111dc584c110097a';
    const cityInput = document.querySelector('.search-box input').value;
    const countryInput = document.querySelector('.search-box input').value; // Add an input field for the country

    if (cityInput === '' || countryInput==='') return;

    try {
        const cityWeather = await getCityWeather(cityInput, countryInput, APIKEY);
       
        handleWeatherData(cityWeather);
        await updateHourlyForecast(cityWeather.coord.lat, cityWeather.coord.lon);
        await updateWeeklyForecast(cityWeather.coord.lat, cityWeather.coord.lon);
  
    } catch (error) {
        console.error('Error fetching data:', error);
        handleNotFound();
    }
});
async function updateLocationAndWeather() {
    try {
        const currentLocationWeather = await getCurrentLocationWeather();
        handleWeatherData(currentLocationWeather);
        await updateHourlyForecast(currentLocationWeather.coord.lat, currentLocationWeather.coord.lon);
        await updateWeeklyForecast(currentLocationWeather.coord.lat, currentLocationWeather.coord.lon);
   
    } catch (error) {
        console.error('Error fetching data:', error);
        handleNotFound();
    }
}
async function getCurrentLocationWeather() {
    const APIKEY = 'e38b8adced5269e5111dc584c110097a';

    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(async function (position) {
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;
            const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${APIKEY}`);
            const json = await response.json();
            resolve(json);
        }, reject);
    });
}

   async function getCityWeather(city,country, apiKey) {
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city},${country}&units=metric&appid=${apiKey}`);
    return response.json();
}

async function updateHourlyForecast(latitude, longitude) {
    const APIKEY = 'e38b8adced5269e5111dc584c110097a';

    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&units=metric&exclude=current,minutely,daily,alerts&appid=${APIKEY}`);

        const data = await response.json();

        // Clear previous hourly forecast
        hourlyList.innerHTML = '';

        // Display the next 24 hours forecast
        if (data.list && data.list.length > 0) {
            const rowContainer = document.createElement('div');
    rowContainer.classList.add('scroll');
    rowContainer.style.display = 'flex';

            for (let i = 0; i < 8; i++) {
                const hourData = data.list[i];
                const dateTime = new Date(hourData.dt * 1000);
                const formattedDateTime = dateTime.toLocaleString('en-US', { weekday: 'short',  hour: 'numeric', minute: '2-digit' });
                const temperature = parseInt(hourData.main.temp);
                const weatherDescription = hourData.weather[0].description;
                const humidity = hourData.main.humidity;
                const rainChances = hourData.pop * 100; // Probability of precipitation (pop) converted to percentage
                const weatherIcon = hourData.weather[0].icon;
                const listItem = document.createElement('ul');
                listItem.innerHTML = `
                <img src=" https://openweathermap.org/img/wn/${weatherIcon}.png"><br>
                <strong>${formattedDateTime}</strong>:

                     <strong>${temperature}°C<br></strong>
                  <strong> ${weatherDescription}<br></strong>
                   <strong> Humidity: ${humidity}%<br></strong>
                    <strong>Rain: ${rainChances}%</strong>
                    `;
                hourlyList.appendChild(listItem);
                listItem.style.border="2px solid white";
                listItem.style.borderRadius="20px ";
                listItem.style.backgroundColor="rgba(255, 255, 255, 0.421)";


                // Add space between list items
            }
        } else {
            console.error('Hourly data is not available.');
        }
    } catch (error) {
        console.error('Error fetching hourly forecast:', error);
    }
}   
   
   function updateLocation() {
    navigator.geolocation.getCurrentPosition( async function (position) {
       const latitude = position.coords.latitude;
       const longitude = position.coords.longitude;
        cityElement.textContent = `City: ${city}`;
        cityElement.textContent = `Country: ${country}`;
        getWeatherData(latitude, longitude);
    });
   }
   
   window.addEventListener('load', async () => {
    try {
        updateLocation();
        updateDateTime();
        const currentLocationWeather = await getCurrentLocationWeather();
        handleWeatherData(currentLocationWeather);
    } catch (error) {
        console.error('Error fetching data', error);
        handleNotFound();
    }
});

   /*weeklyforecast*/
   async function updateWeeklyForecast(latitude, longitude) {
    const APIKEY = 'e38b8adced5269e5111dc584c110097a';

    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&units=metric&exclude=current,minutely,hourly,alerts&appid=${APIKEY}`);
        const data = await response.json();
        if (!weeklylist) {
            console.error('Weekly forecast element not found in the DOM.');
            return;}
        // Clear previous forecast
        weeklylist.innerHTML = '';
        if (data.list && data.list.length > 0) {
            const dailyData = data.list.filter((item, index) => index % 8 === 0);

            for (let i = 0; i < 5; i++) {
                const dayData = dailyData[i];
                const dateTime = new Date(dayData.dt * 1000);
                const formattedDateTime = dateTime.toLocaleString('en-US', { weekday: 'short',  });
                const temperature = parseInt(dayData.main.temp);
                const weatherDescription = dayData.weather[0].description;
                const humidity = dayData.main.humidity;
                const rainChances = dayData.pop * 100; // Probability of precipitation (pop) converted to percentage
                const weatherIcon = dayData.weather[0].icon;

                const listItem = document.createElement('ol');
                listItem.innerHTML = `
                <img src=" https://openweathermap.org/img/wn/${weatherIcon}.png"><br>
                <strong>${formattedDateTime}</strong>:

                    <strong> ${temperature}°C</strong>
                  <strong>  ${weatherDescription}<br></strong>
                   <strong> Humidity: ${humidity}%</strong>
                   <strong> Rain Chances: ${rainChances}%</strong>
                    `;
                weeklylist.appendChild(listItem);
                listItem.style.border="2px solid white";
                listItem.style.background="rgba(255, 255, 255, 0.421)";
                listItem.style.borderRadius="20px";
                // Add space between list items
                weeklylist.appendChild(document.createElement('br'));
            }
        
        }else {
            console.error('Daily forecast data is not available.');
        } /*else {
    console.error('Weekly forecast element not found in the DOM.');
        }*/
    } catch (error) {
        console.error('Error fetching daily forecast:', error);
    }
} 

   

function handleWeatherData(json) {

    console.log('weather data:,json')
    weatherbox.classList.add('active');
    weatherdetails.classList.add('active');
    error404.classList.remove('active');
const sunriseTimestamp = json.sys.sunrise * 1000; // Convert seconds to milliseconds
    const sunsetTimestamp = json.sys.sunset * 1000; // Convert seconds to milliseconds

    const sunriseTime = new Date(sunriseTimestamp).toLocaleTimeString();
    const sunsetTime = new Date(sunsetTimestamp).toLocaleTimeString();

    sunriseElement.textContent = `Sunrise: ${sunriseTime}`;
    sunsetElement.textContent = `Sunset: ${sunsetTime}`;
   
    const seaLevel = json.main.sea_level;
    const groundLevel = json.main.grnd_level;

    seaLevelElement.textContent = `Sea Level: ${seaLevel} hPa`;
    groundLevelElement.textContent = `Ground Level: ${groundLevel} hPa`;
    const airPurity = json.main.aqi; // Assuming AQI (Air Quality Index) is available in the API response

    if (airPurity !== undefined) {
        airPurityElement.textContent = `Air Purity: ${airPurity}`;
        airPurityElement.style.display = 'flex'; // Show the air purity element
    } else {
        airPurityElement.style.display = 'none'; // Hide the air purity element if not available
    }


    const sunriseIcon = document.getElementById('sunrise-icon') || createIconElement('🌅');
const sunsetIcon = document.getElementById('sunset-icon') || createIconElement('🌇');
const seaLevelIcon = document.getElementById('sea-level-icon') || createIconElement('🌊');
const groundLevelIcon = document.getElementById('ground-level-icon') || createIconElement('⛰️');

sunriseElement.insertBefore(sunriseIcon, sunriseElement.firstChild);
sunsetElement.insertBefore(sunsetIcon, sunsetElement.firstChild);
seaLevelElement.insertBefore(seaLevelIcon, seaLevelElement.firstChild);
groundLevelElement.insertBefore(groundLevelIcon, groundLevelElement.firstChild);

function createIconElement(emoji) {
    const iconElement = document.createElement('span');
    iconElement.classList.add('icon');
    iconElement.textContent = emoji;
    return iconElement;
}
    const image = document.querySelector('.weather-box img');
    const temperature = document.querySelector('.weather-box .temperature');
    const description = document.querySelector('.weather-box .description');
    const humidity= document.querySelector('.weather-details .humidity span ');
    const wind = document.querySelector('.weather-details .wind span ');
    const pressure= document.querySelector('.weather-details .pressure span ');

   const background=document.querySelector('.background');
   const audioElement = document.getElementById('bg-audio');
    switch (json.weather[0].main) {
        case 'Clear':
            image.src = 'images/clear.png';
            background.style.backgroundImage='url("images/clear-background.jpg")';
            audioElement.src ='sound effects/clear.mp3';
            break;
        case 'Rain':
            image.src = 'images/rain.png';
            background.style.backgroundImage='url("images/rainbackground.jpg")';
            audioElement.src = 'sound effects/rain.mp3';
            break;
            case 'Storm':
                image.src = 'images/rain.png';
            background.style.backgroundImage='url("images/rain-background.jpg")';
            audioElement.src = 'sound effects/strom.mp3';

            break;
        case 'Snow':
            image.src = 'images/snow.png';
          background.style.backgroundImage='url("images/snow-background.jpg")';
          audioElement.src = 'sound effects/snow.mp3';

            break;
        case 'Clouds':
            image.src = 'images/cloud.png';
            background.style.backgroundImage='url("images/clouds-background.jpg")';
            audioElement.src = 'sound effects/clear.mp3';

            break;
        case 'Mist':
            image.src = 'images/mist.png';
          background.style.backgroundImage='url("images/mist-background.jpg")';
          audioElement.src = 'sound effects/fog.mp3';
          break;

        case 'Haze':
            image.src = 'images/mist.png';
           background.style.backgroundImage='url("images/haze-background.webp")';
           audioElement.src = 'sound effects/fog.mp3';

            break;
            case 'Fog':
                image.src = 'images/mist.png';
                background.style.backgroundImage='url("images/mist-background.jpg")';
                audioElement.src = 'sound effects/fog.mp3';
       break;
       case 'Smoke':
                image.src = 'images/mist.png';
                background.style.backgroundImage='url("images/haze-background.webp")';
                audioElement.src = 'sound effects/fog.mp3';
       break;
       
            default:
            image.src = 'images/cloud.png';
          background.style.backgroundImage='url("images/defaultbackground.jpg")';
          audioElement.src = 'sound effects/clear.mp3';

            break;
    }

    temperature.innerHTML = `${parseInt(json.main.temp)}<span>°C</span>`;
    description.innerHTML = `${json.weather[0].description}`;
    humidity.innerHTML = `${json.main.humidity}%`;
    wind.innerHTML = `${parseInt(json.wind.speed)} km/hr`;
    pressure.innerHTML = `${(json.main.pressure)} hpa`;
    cityElement.textContent = json.name; 
     

}

function updatelLocation(){
    navigator.geolocation.getCurrentPosition(function(position){
        const latitude=position.coords.latitude;
        const longitude=position.coords.longitude;
        locationElement.textContent=`Current Location:${latitude},${longitude}`;
    });
}
setInterval(updateDateTime,1000);
function updateDateTime() {
    const currentDate = new Date();
    const options = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
   day:'numeric',
    hour:'numeric',
    minute:'numeric',
   second:'numeric',
    };
dateElement.innerHTML=currentDate.toLocaleDateString('en-US', options);

}
});
