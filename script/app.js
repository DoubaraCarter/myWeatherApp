let url = "https://api.openweathermap.org/data/2.5/weather?q=";
let apiKey = "e34bae7db1e26852bb5f4dd0f0c8d05b";
let selectedCity = document.querySelector(".city")
let weatherIcon = document.querySelector(".icon")
let weatherDesc = document.querySelector(".description")
let temperature = document.querySelector(".temp")
let humid =       document.querySelector(".humidity")
let breeze = document.querySelector(".wind")
let searchBtn = document.querySelector(".search button")
let searchBar = document.querySelector(".search-bar")

async function getWeather(city) {
    const response = await fetch(url + city + "&units=metric&appid=" + apiKey);
    const data = await response.json();
    console.log(data)


    // Function to display the weather

         function displayWeather(data){
                let  { name }  = data;
                let  {description}  = data.weather[0];
                let  { temp, humidity } = data.main;
                let  { speed } = data.wind;

                selectedCity.innerText = `City: ${name}`;
                weatherDesc.innerText = description;
                temperature.innerText = `${temp} °C`;
                humid.innerText = `Humidity: ${humidity}%`;
                breeze.innerText = `Wind speed: ${speed}km/h`;
                document.querySelector(".weather").classList.remove("loading");
        }

        displayWeather(data);

        // Search button

        function search(){
            getWeather(document.querySelector(".search-bar").value);
        }
        searchBtn.addEventListener("click", search);

        searchBar.addEventListener("keyup", function (e) {
            if (e.key == "Enter") {
                search();
            }
        });
}
getWeather('Port Harcourt');
