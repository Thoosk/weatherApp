import "./reset.css";
import "./style.css";
import "core-js/stable";
import "regenerator-runtime/runtime";
import { weatherAPI, giphyAPI } from "../apiKeys";
import clearSky from "./images/icons/clear_sky.svg";
import fewClouds from "./images/icons/few_clouds.svg";
import scatteredClouds from "./images/icons/scattered_clouds.svg";
import brokenClouds from "./images/icons/broken_clouds.svg";
import showerRain from "./images/icons/shower_rain.svg";
import rain from "./images/icons/rain.svg";
import thunderstorm from "./images/icons/thunderstorm.svg";
import snow from "./images/icons/snow.svg";
import mist from "./images/icons/mist.svg";

function init() {
  const headerEl = document.querySelector("header");
  const headerH1 = document.createElement("h1");

  headerH1.innerHTML = "WeatherApp";

  headerEl.appendChild(headerH1);

  // init weather card
  const weatherCard = document.querySelector("#weather-card");
  let weatherImg = document.createElement("img");
  weatherImg.classList.add("current-weather-img");
  weatherCard.appendChild(weatherImg);

  let cityStats = document.createElement("div");
  cityStats.setAttribute("id", "cityStats");

  let currCity = document.createElement("h2");
  currCity.innerHTML = "Graz";
  let currTime = document.createElement("h3");
  currTime.innerHTML = `${getTime().date} <br> ${getTime().time}`;

  cityStats.appendChild(currCity);
  cityStats.appendChild(currTime);
  weatherCard.appendChild(cityStats);

  const weatherInfoSec = document.createElement("section");
  weatherInfoSec.setAttribute("id", "weather-stats");

  for (let index = 0; index < 6; index++) {
    let pEl = document.createElement("p");
    pEl.classList.add("weather-stat");
    weatherInfoSec.appendChild(pEl);
  }
  weatherCard.appendChild(weatherInfoSec);

  //create gif
  const gifDiv = document.querySelector("#gif-div");

  const gifInfo = document.createElement("p");
  gifInfo.innerHTML =
    "Here's an GIF randomly generated on <br> what the current weather resembles, enjoy!";

  const randomGifEl = document.createElement("img");
  randomGifEl.setAttribute("id", "gifEl");
  randomGifEl.alt = "random gif chosen on the current weather";
  gifDiv.appendChild(randomGifEl);
  gifDiv.appendChild(gifInfo);

  // INIT
  let weatherTest = Promise.resolve(getWeatherData("graz")).then((result) => {
    return extractNeededData(result);
  });
  weatherTest.then((result) => {
    setCurrentWeather("Graz", result);
    loadWeatherGif(result[7]);
  });
}

function getTime() {
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  let options = {
      timeZone: `${timeZone}`,
      year: "numeric",
      month: "numeric",
      day: "numeric",
    },
    formatterDate = new Intl.DateTimeFormat([], options);

  let options2 = {
      timeZone: `${timeZone}`,
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
    },
    formatterTime = new Intl.DateTimeFormat([], options2);

  let timeObj = {
    date: formatterDate.format(new Date()),
    time: formatterTime.format(new Date()),
  };
  return timeObj;
}

//get userInput with the given city and set the new weather on the weatherCard
const submitBtn = document.querySelector("#submit-task");
submitBtn.addEventListener("click", async () => {
  let inputEl = document.querySelector("#city");
  let newCityData = await getWeatherData(inputEl.value);
  let extractedData = extractNeededData(newCityData);
  setCurrentWeather(inputEl.value, extractedData);
  inputEl.value = "";
});

//set weather in the DOM
function setCurrentWeather(city, currentWeatherData) {
  // for the init -> default value should be graz for the first visit of the website
  city = typeof city !== "undefined" ? city : "Graz";
  const weatherCard = document.querySelector("#weather-card");
  const weatherInfo = document.querySelectorAll(".weather-stat");
  weatherInfo.forEach((el, index) => {
    el.innerHTML = currentWeatherData[index];
  });

  // set the icon for the current weather
  setWeatherIcon(currentWeatherData[7]);

  // set the name of the current city
  let cityName = weatherCard.firstElementChild.nextSibling.firstElementChild;
  cityName.textContent = city;

  // set the gif for the current weather
  loadWeatherGif(currentWeatherData[7]);
}

// set a different icon for different weather
function setWeatherIcon(weather) {
  const weatherImg = document.querySelector(".current-weather-img");
  switch (weather.toLowerCase()) {
    case "clear sky":
      weatherImg.src = "./clear_sky.svg";
      break;
    case "few clouds":
      weatherImg.src = "./few_clouds.svg";
      break;
    case "scattered clouds":
      weatherImg.src = "./scattered_clouds.svg";
      break;
    case "broken clouds":
      weatherImg.src = "./broken_clouds.svg";
      break;
    case "shower rain":
      weatherImg.src = "./shower_rain.svg";
      break;
    case "rain":
      weatherImg.src = "./rain.svg";
      break;
    case "thunderstorm":
      weatherImg.src = "./thunderstorm.svg";
      break;
    case "snow":
      weatherImg.src = "./snow.svg";
      break;
    case "mist":
      weatherImg.src = "./mist.svg";
      break;
    default:
      weatherImg.src = "./broken_clouds.svg";
  }
}

// async function for getting a GIF of the current weather
async function loadWeatherGif(currWeather) {
  const randomGifEl = document.querySelector("#gifEl");

  if (currWeather == "broken clouds") {
    currWeather = "cloudy";
  }

  let weatherGif;
  try {
    const response = await fetch(
      `https://api.giphy.com/v1/gifs/translate?api_key=${giphyAPI}&s=${currWeather}`,
      {
        mode: "cors",
      }
    );
    weatherGif = await response.json();
  } catch (err) {
    console.log(err);
    console.log("Error retrieving the gif");
  }

  randomGifEl.src = weatherGif.data.images.original.url;
}

// extract the data in a array
function extractNeededData(weatherDataObj) {
  let currWeather = [
    `Temperature:  ${weatherDataObj.main.temp} °C`,
    `Feels like: ${weatherDataObj.main.feels_like} °C`,
    `Lowest Temperature: ${weatherDataObj.main.temp_min} °C`,
    `Highest Temperature: ${weatherDataObj.main.temp_max} °C`,
    `Wind Speed: ${weatherDataObj.wind.speed} km/h`,
    `Humidity-Levels: ${weatherDataObj.main.humidity}%`,
    `Pressure: ${weatherDataObj.main.pressure}`,
    weatherDataObj.weather[0].description,
  ];
  return currWeather;
}

// get weather Info
async function getWeatherData(city) {
  if (city === "") {
    alert("City field is empty");
  }

  let url = `https://api.openweathermap.org/data/2.5/weather?q=${city.toLowerCase()}&units=metric&appid=${weatherAPI}`;
  let weatherInfo;

  try {
    const response = await fetch(url, {
      mode: "cors",
    });
    weatherInfo = await response.json();

    // if the city isnt found e.g. if the code 404 gets returned
    if (weatherInfo.cod === "404") {
      throw new Error("city not found");
    }
  } catch (err) {
    alert("Please type a valid City in the field");
    console.log(err);
  }

  return weatherInfo;
}

init();
