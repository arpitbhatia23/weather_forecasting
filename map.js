async function getCityWeather(city, apiKey) {
    // Your implementation
  }

  function handleNotFound() {
    // Your implementation
  }

document.addEventListener('DOMContentLoaded', function () {
    const markers = [];
    const container = document.querySelector('.container');
    const search = document.querySelector('.search-box button');
    const APIKEY = 'e38b8adced5269e5111dc584c110097a';
    const map = L.map('map').setView([0, 0], 10);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
    function showLoadingSpinner() {
        loadingSpinner.style.display = 'block';
    }

    function hideLoadingSpinner() {
        loadingSpinner.style.display = 'none';
    }

    function showMapLoadingState() {
        // Implement logic to show a loading state for the map
    }

    function hideMapLoadingState() {
        // Implement logic to hide the loading state for the map
    }
    async function getWeatherData(city) {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${APIKEY}`);
        const data = await response.json();
        return data;
    }

   


    // Function to add a marker with weather information to the map
    async function addWeatherMarker(city) {
      console.log('adding maker for city',city)
        // Remove previous markers
        markers.forEach(marker => map.removeLayer(marker));
        markers.length = 0;
        try {
        const weatherData = await getWeatherData(city);
        if (!weatherData || !weatherData.coord || !weatherData.weather || !weatherData.main) {
            console.error('Invalid weather data for city:', city);
            return;
        }

        const { coord, weather, main } = weatherData;
        const { lat, lon } = coord;
        const { description, icon } = weather[0];
        const temperature = main.temp;
        const humidity = main.humidity;

        const marker = L.marker([lat, lon]).addTo(map);
        marker.bindPopup(`<b>${city}</b><br>${description}<br>${temperature}°C<br>
        Humidity: ${humidity}%<br>
               <img src="http://openweathermap.org/img/w/${icon}.png" alt="Weather Icon">`);

        // Store the marker in the markers array
        markers.push(marker);

        map.setView([lat, lon], 9);
    } catch (error) {
        console.error('Error fetching weather data:', error);
        // Handle the error, e.g., display an error message to the user
    }
  }
  function addUserLocationMarker() {
        navigator.geolocation.getCurrentPosition(function (position) {
            const userLocation = [position.coords.latitude, position.coords.longitude];

            // Remove previous markers
            markers.forEach(marker => map.removeLayer(marker));
            markers.length = 0;

            const userMarker = L.marker(userLocation).addTo(map);
            userMarker.bindPopup('Your Location').openPopup();
        });
      } addUserLocationMarker();
  
  async function handleWeatherData(cityWeather) {
        // Implement your logic to handle weather data
        // ...

        // Example: Call addWeatherMarker
        addWeatherMarker(cityWeather.name);
    }
    search.addEventListener('click', async () => {
        const cityInput = document.querySelector('.search-box input').value;

        if (cityInput === '') return;

        try {
            const cityWeather = await getWeatherData(cityInput);
            console.log('Weather data:', cityWeather);
            handleWeatherData(cityWeather);
            addWeatherMarker(cityInput)
        } catch (error) {
            console.error('Error fetching data:', error);
            // Handle the error, e.g., display an error message to the user
        }
    });
    search.addEventListener('click', async () => {
        const cityInput = document.querySelector('.search-box input').value;

        if (cityInput === '') return;

        showLoadingSpinner();

        try {
            const cityWeather = await getWeatherData(cityInput);
            console.log('Weather data:', cityWeather);
            handleWeatherData(cityWeather);
            addWeatherMarker(cityInput);
        } catch (error) {
            handleWeatherError(error);
        } finally {
            hideLoadingSpinner();
        }
    });

});
