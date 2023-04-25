const citySearch = document.querySelector("#city-search");
var currentCity = document.querySelector("#currentCity");

//My API on Open Weather
const APIKey = "514ba0c0791197d2ce524add0a58cd02";


// ******* Locate the city ********
const cityList = document.querySelector("#city-list");

citySearch.addEventListener("keyup", event => {
  const query = event.target.value;
  if (query.length > 2) {
  
    const url = `https://api.openweathermap.org/data/2.5/find?q=${query}&appid=${APIKey}`;
    fetch(url)
      .then(response => response.json())
      .then(data => {
        const cities = data.list;
        cityList.innerHTML = "";
        cities.forEach(city => {
        const li = document.createElement("li");
          li.textContent = `${city.name}, ${city.sys.country}`;
          li.addEventListener("click", () => {
            citySearch.value = `${city.name}, ${city.sys.country}`;
            cityList.innerHTML = "";
          });
          cityList.appendChild(li);
        });
      })
      .catch(error => console.error(error));
  } 
});




//  ****** GET DATA AND PRESENT WITH THE WEATHER ******
function getWeather(city) {
  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${APIKey}&units=metric`;

  fetch(apiUrl)
    .then(response => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error("Error getting weather data");
      }
    })
    .then(data => {
      const temperature = data.main.temp;
      const windSpeed = data.wind.speed;
      const humidity = data.main.humidity;

      // Display the weather
      const weatherDataElement = document.getElementById("selected-city");
      weatherDataElement.innerHTML = `
        <h3>${city}</h3>
        <img src="http://openweathermap.org/img/w/${data.weather[0].icon}.png">
        <p>Temperature: ${temperature} &deg;C</p>
        <p>Wind Speed: ${windSpeed} m/s</p>
        <p>Humidity: ${humidity} %</p>
      `;
    })
}




// ******* 5-Day Forecast *******
function getForecast() {
 
  const city = document.getElementById("city-search").value;

  const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${APIKey}&units=metric`;

  fetch(apiUrl)
    .then(response => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error("Error getting forecast data");
      }
    })
    .then(data => {
      const forecastList = data.list;

      const fiveDayForecast = forecastList.filter((item, index) => {
        return index % 8 === 0;
      });

      const forecastDataElement = document.getElementById("future-forecast");
      forecastDataElement.innerHTML = "";
      fiveDayForecast.forEach(item => {
        const timestamp = item.dt * 1000;
        const date = new Date(timestamp);
        const dayOfWeek = date.toLocaleDateString("en-US", { weekday: "long" });
        const iconCode = item.weather[0].icon;
        const temperature = item.main.temp;
        const windSpeed = item.wind.speed;
        const humidity = item.main.humidity;

        forecastDataElement.innerHTML += `
          <div class="forecast-item">
            <h4>${dayOfWeek}</h4>
            <img src="http://openweathermap.org/img/w/${iconCode}.png">
            <p>Temp: ${temperature} &deg;C</p>
            <p>Wind: ${windSpeed} m/s</p>
            <p>Hum: ${humidity} %</p>
          </div>
        `;
      });
    })
}


//  ***** Call the function on button click *****
$("#search-button").on("click", function() {
  
  const city = document.getElementById("city-search").value;
  getWeather(city);
  getForecast();
});



//  ****** Local Storage and create buttons ****
function saveCities(){
  const newCity = $("#city-search").val();

  const savedCities = JSON.parse(localStorage.getItem("city")) || [];

  if(!savedCities.includes(newCity)){
      savedCities.push(newCity);
      localStorage.setItem("city", JSON.stringify(savedCities));
  }
}

// ***** Create buttons of previous searches *****
function displayCitiesButtons(){
  $("#city-saved").empty();
  const savedCities = JSON.parse(localStorage.getItem("city")) || [];

  for (let i = 0; i < savedCities.length; i++) {
      const city = savedCities[i];
      
      const btn = $(`
      <button type="button" onclick=getWeather('${city}')>${city}</button>
      `)

      $("#city-saved").append(btn)

  }
}

function clearLocalStorage() {
  // Clear all items in local storage
  localStorage.clear();

  // Reset the weather and forecast data on the web page
  const weatherDataElement = document.getElementById("city-search");
  const forecastDataElement = document.getElementById("city-saved");
  weatherDataElement.innerHTML = "";
  forecastDataElement.innerHTML = "";
}







//  ***** Call the function on button click *****
$("#search-button").on("click", function() {
  
  const city = document.getElementById("city-search").value;
  getWeather(city);
  getForecast();
});

