const inputBox = document.querySelector(".input-box");
const searchBtn = document.getElementById("searchBtn");
const weather_img = document.querySelector(".weather-img");
const temperature = document.querySelector(".temperature");
const description = document.querySelector(".description");
const humidity = document.getElementById("humidity");
const wind_speed = document.getElementById("wind-speed");
const location_not_found = document.querySelector(".location-not-found");
const weather_body = document.querySelector(".weather-body");
const toggleCheckbox = document.getElementById("toggleCheckbox");

async function checkWeather(city) {
  const api_key = "ac620bb613b8913399dd39766b48b058";
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${api_key}`;

  const weather_data = await fetch(`${url}`).then((response) =>
    response.json()
  );

  if (weather_data.cod === '404') {
    location_not_found.style.display = "flex";
    weather_body.style.display = "none";
    console.log('error');
    return;
  } else {
    location_not_found.style.display = "none";
    weather_body.style.display = "flex";
  }

  temperature.innerHTML = `${Math.round(weather_data.main.temp - 273.15)}°C`;
  description.innerHTML = `${weather_data.weather[0].description}`;
  humidity.innerHTML = `${weather_data.main.humidity}%`;
  wind_speed.innerHTML = `${weather_data.wind.speed}Km/H`;

  switch (weather_data.weather[0].main) {
    case "Clouds":
      weather_img.src = "/assets/cloud.png";
      break;
    case "Clear":
      weather_img.src = "/assets/clear.png";
      break;
    case "Rain":
      weather_img.src = "/assets/rain.png";
      break;
    case "Mist":
      weather_img.src = "/assets/mist.png";
      break;
    case "Snow":
      weather_img.src = "/assets/snow.png";
      break;
  }

  console.log(weather_data);
}

// Function to convert Celsius to Fahrenheit
function celsiusToFahrenheit(celsius) {
  return (celsius * 9/5) + 32;
}

// Function to convert Fahrenheit to Celsius
function fahrenheitToCelsius(fahrenheit) {
  return (fahrenheit - 32) * 5/9;
}

// Function to update temperature based on toggle state
function updateTemperature() {
  const currentTemperatureText = temperature.innerText;
  const currentTemperatureValue = parseFloat(currentTemperatureText);

  if (toggleCheckbox.checked) {
    // Convert to Fahrenheit
    const fahrenheit = celsiusToFahrenheit(currentTemperatureValue);
    temperature.innerHTML = `${fahrenheit.toFixed(2)} <sup>°F</sup>`;
  } else {
    // Convert to Celsius
    const celsius = fahrenheitToCelsius(currentTemperatureValue);
    temperature.innerHTML = `${celsius.toFixed(2)} <sup>°C</sup>`;
  }
}

toggleCheckbox.addEventListener("change", updateTemperature);
updateTemperature();


const locationBtn = document.getElementById("locationBtn");
locationBtn.addEventListener("click", () => {
  resetToggle();
  getUserCoordinates();
});

// Rename the search button variable to avoid conflict
const searchButton = document.getElementById("searchBtn");
searchButton.addEventListener("click", () => {
  const inputLocation = inputBox.value.trim(); 
  if (inputLocation !== "") {
    checkWeather(inputLocation);
    resetToggle();
  }
});

// Function to reset the toggle to default position
function resetToggle() {
  toggleCheckbox.checked = false; 
  updateTemperature(); 
}

// getUserCoordinates function
function getUserCoordinates() {
  navigator.geolocation.getCurrentPosition(
    (position) => {
      const { latitude, longitude } = position.coords; 
      const API_KEY = "ac620bb613b8913399dd39766b48b058";
      const API_URL = `https://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=${API_KEY}`;
      fetch(API_URL)
        .then((response) => response.json())
        .then((data) => {
          const { name } = data[0];
          getWeatherDetails(name, latitude, longitude);
        })
        .catch(() => {
          alert("An error occurred while fetching the city name!");
        });
    },
    (error) => {
      if (error.code === error.PERMISSION_DENIED) {
        alert(
          "Geolocation request denied. Please reset location permission to grant access again."
        );
      } else {
        alert("Geolocation request error. Please reset location permission.");
      }
    }
  );
}

function updateWeatherDetails(weatherData) {
  temperature.innerHTML = `${Math.round(weatherData.main.temp - 273.15)}°C`;
  description.innerHTML = `${weatherData.weather[0].description}`;
  humidity.innerHTML = `${weatherData.main.humidity}%`;
  wind_speed.innerHTML = `${weatherData.wind.speed}Km/H`;

  switch (weatherData.weather[0].main) {
    case "Clouds":
      weather_img.src = "/assets/cloud.png";
      break;
    case "Clear":
      weather_img.src = "/assets/clear.png";
      break;
    case "Rain":
      weather_img.src = "/assets/rain.png";
      break;
    case "Mist":
      weather_img.src = "/assets/mist.png";
      break;
    case "Snow":
      weather_img.src = "/assets/snow.png";
      break;
    default:
      weather_img.src = "";
  }
   weather_img.style.display = "block";
   weather_img.style.margin = "0 auto";
}

function getWeatherDetails(city, latitude, longitude) {
  const api_key = "ac620bb613b8913399dd39766b48b058";
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${api_key}`;

  fetch(url)
    .then((response) => response.json())
    .then((weatherData) => {
      if (weatherData.cod === '404') {
        location_not_found.style.display = "flex";
        weather_body.style.display = "none";
        console.log('error');
        return;
      } else {
        location_not_found.style.display = "none";
        weather_body.style.display = "block"; 
      }
      updateWeatherDetails(weatherData);
    })
    .catch(() => {
      alert("An error occurred while fetching weather data!");
    });
}
