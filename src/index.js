import "./reset.css";
import "./style.css";
import weatherImgSrc from "./images/iconmonstr-weather-2.svg";
import "core-js/stable";
import "regenerator-runtime/runtime";

/// DOM
const headerEl = document.querySelector("header");

const headerH1 = document.createElement("h1");

headerH1.innerHTML = "WeatherApp";

headerEl.appendChild(headerH1);

//weather card
const weatherCard = document.querySelector("#weather-card");

let weatherImg = document.createElement("img");
weatherImg.classList.add("current-weather-img");
weatherImg.src = weatherImgSrc;

weatherCard.appendChild(weatherImg);

const weatherInfoSec = document.createElement("section");
weatherInfoSec.setAttribute("id", "weather-stats");

for (let index = 0; index < 6; index++) {
  let pEl = document.createElement("p");
  pEl.classList.add("weather-stat");
  pEl.innerHTML = "Stat" + index;
  weatherInfoSec.appendChild(pEl);
}

weatherCard.appendChild(weatherInfoSec);

//get userInput
const submitBtn = document.querySelector("#submit-task");

let userInput;

submitBtn.addEventListener("click", async () => {
  let inputEl = document.querySelector("#city");
  let newCityData = await getWeatherData(inputEl.value);
  let extractedData = extractNeededData(newCityData);
  setCurrentWeather("Graz", extractedData);
  inputEl.value = "";
});

//set weather in the DOM
function setCurrentWeather(city, currentWeatherData) {
  // for the init -> default value should be graz if a user vists the website
  city = typeof city !== "undefined" ? city : "Graz";
  const weatherCard = document.querySelector("#weather-card");
  const weatherImg = weatherCard.firstElementChild;
  const weatherInfo = document.querySelectorAll(".weather-stat");

  //   console.log(currentWeatherData);
  weatherInfo.forEach((el, index) => {
    el.innerHTML = currentWeatherData[index];
  });
}

function extractNeededData(weatherDataObj) {
  let currWeather = [
    `Temperature:  ${weatherDataObj.main.temp}°`,
    `Feels like: ${weatherDataObj.main.feels_like}°`,
    `Lowest Temperature: ${weatherDataObj.main.temp_min}°`,
    `Highest Temperature: ${weatherDataObj.main.temp_max}°`,
    `Pressure: ${weatherDataObj.main.pressure}`,
    `Humidity: ${weatherDataObj.main.humidity}`,
    weatherDataObj.weather[0].description,
  ];
  return currWeather;
}

// INIT
let weatherTest = Promise.resolve(getWeatherData("graz")).then((result) => {
  console.log(result);
  return extractNeededData(result);
});
weatherTest.then((result) => {
  setCurrentWeather("Graz", result);
});

// get weather Info
async function getWeatherData(city) {
  if (city === "") {
    alert("City field is empty");
  }

  let url =
    "https://api.openweathermap.org/data/2.5/weather?q=" +
    city.toLowerCase() +
    "&units=metric&appid=d2d22899da9c0e25e8e1d9436fecd822";

  let weatherInfo;

  try {
    const response = await fetch(url, {
      mode: "cors",
    });
    weatherInfo = await response.json();

    // if the city isnt found e.g. if the json has the code 404
    if (weatherInfo.cod === "404") {
      throw new Error("city not found");
    }
  } catch (err) {
    alert("Please type a valid City in the field");
    console.log(err);
    console.log("Error retrieving weatherinfo");
  }

  console.log(weatherInfo.main);
  return weatherInfo;
}

// getWeatherData("graz");
