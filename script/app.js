const url = "https://api.openweathermap.org/data/2.5/weather?q=";
const apiKey = "e34bae7db1e26852bb5f4dd0f0c8d05b";

const selectedCity = document.querySelector(".city");
const weatherIcon = document.querySelector("#weatherIcon");
const weatherDesc = document.querySelector(".description");
const temperature = document.querySelector(".temp");
const humid = document.querySelector(".humidity");
const breeze = document.querySelector(".wind");
const searchBtn = document.querySelector("button");
const searchBar = document.querySelector("input");
const localTimeElem = document.querySelector(".local-time");
const sunriseElem = document.querySelector(".sunrise");
const sunsetElem = document.querySelector(".sunset");

async function getWeather(city) {
  try {
    const response = await fetch(url + city + "&units=metric&appid=" + apiKey);
    const data = await response.json();

    if (data.cod !== 200) throw new Error(data.message);

    displayWeather(data);
    getForecast(city);
  } catch (err) {
    alert("City not found.");
    console.error(err);
  }
}

function displayWeather(data) {
  const { name } = data;
  const { description, icon } = data.weather[0];
  const { temp, humidity } = data.main;
  const { speed } = data.wind;

  const sunrise = new Date(data.sys.sunrise * 1000).toLocaleTimeString();
  const sunset = new Date(data.sys.sunset * 1000).toLocaleTimeString();
  const localTime = new Date(data.dt * 1000).toLocaleTimeString();

  selectedCity.innerText = `Location: ${name}`;
  weatherDesc.innerText = description;
  temperature.innerText = `${Math.round(temp)} °C`;
  humid.innerText = `Humidity: ${humidity}%`;
  breeze.innerText = `Wind speed: ${speed} km/h`;
  weatherIcon.src = `https://openweathermap.org/img/w/${icon}.png`;
  sunriseElem.innerText = `Sunrise: ${sunrise}`;
  sunsetElem.innerText = `Sunset: ${sunset}`;
  localTimeElem.innerText = `Local Time: ${localTime}`;
}

async function getForecast(city) {
  const res = await fetch(
    `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apiKey}`
  );
  const data = await res.json();

  const forecastContainer = document.querySelector("#forecast");
  forecastContainer.innerHTML = "";

  const dailyForecast = {};

  data.list.forEach((entry) => {
    const date = entry.dt_txt.split(" ")[0];
    if (!dailyForecast[date] && Object.keys(dailyForecast).length < 5) {
      dailyForecast[date] = entry;
    }
  });

  Object.values(dailyForecast).forEach((day) => {
    const date = new Date(day.dt * 1000);
    const temp = day.main.temp;
    const icon = day.weather[0].icon;
    const desc = day.weather[0].description;

    forecastContainer.innerHTML += `
      <div class="flex flex-col items-center bg-white/10 rounded-lg p-2 text-sm">
        <p>${date.toDateString().split(" ")[0]}</p>
        <img src="https://openweathermap.org/img/w/${icon}.png" class="w-10 h-10" />
        <p>${Math.round(temp)}°C</p>
        <p class="capitalize">${desc}</p>
      </div>
    `;
  });
}

// Search functionality
function search() {
  const city = searchBar.value.trim();
  if (city) {
    getWeather(city);
  }
}

searchBtn.addEventListener("click", search);
searchBar.addEventListener("keyup", function (e) {
  if (e.key === "Enter") {
    search();
  }
});

// Geolocation on load
window.addEventListener("load", () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        const geoUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;
        const response = await fetch(geoUrl);
        const data = await response.json();
        displayWeather(data);
        getForecast(data.name);
      },
      (err) => {
        console.warn(err);
        getWeather("Port Harcourt");
      }
    );
  } else {
    getWeather("Port Harcourt");
  }
});

