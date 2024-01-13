let activeOption1 = document.querySelector(".activeOption1");
let activeOption2 = document.querySelector(".activeOption2");

let searchSection = document.querySelector(".searchSection");
let weatherBox = document.querySelector(".weatherBox");
let grantLocation = document.querySelector(".grantLocation");

let currentTab = activeOption1;
currentTab.classList.add("currentTab");

activeOption2.addEventListener("click", () => {
  switchTab(activeOption2);
});
activeOption1.addEventListener("click", () => {
  switchTab(activeOption1);
});

// switchTab function
function switchTab(clickedTab) {
  if (clickedTab != currentTab) {
    currentTab.classList.remove("currentTab");
    currentTab = clickedTab;
    currentTab.classList.add("currentTab");
    if (currentTab == activeOption1) {
      searchSection.classList.remove("active");
      getFromsessionStorage();
    } 
    else if (currentTab ==   activeOption2) {
      searchSection.classList.add("active");
      weatherBox.classList.remove("active");
      grantLocation.classList.remove("active");
    }
  }
}

//Location get function
let locationBtn = document.querySelector("#locationBtn");
grantLocation.classList.add("active");
locationBtn.addEventListener("click", getLocation);
//check if browser support geo location
function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition);
    grantLocation.classList.remove("active");
    loadingImg.classList.add("active");
  }
}

//get user cordinates and save it on session storage by converting it string
function showPosition(position) {
  const userCoordinates = {
    lat: position.coords.latitude,
    lon: position.coords.longitude,
  };

  sessionStorage.setItem("user-coordinates", JSON.stringify(userCoordinates));
  fetchUserWeatherInfo(userCoordinates);
}

//get form session storage
function getFromsessionStorage() {
  const getLocalCordinates = sessionStorage.getItem("user-coordinates");
  if (!getLocalCordinates) {
    grantLocation.classList.add("active");
  } else {
    grantLocation.classList.remove("active");
    loadingImg.classList.add("active");
    const coordinates = JSON.parse(getLocalCordinates);
    fetchUserWeatherInfo(coordinates);
  }
}

//fetch API
const API_KEY = "d20acb8bb5cec00914bdc9dadae5fcb7";
let loadingImg = document.getElementById("loadingImg");


async function fetchUserWeatherInfo(coordinates) {
  const { lat, lon } = coordinates;
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
    ).then((response) => response.json());
    loadingImg.classList.remove("active");
    weatherBox.classList.add("active");
    render(response);
  } catch (error) {
    alert("Your Browser not support Geo Location Feature");
  }
}
function render(response) {
  let cityName = document.getElementById("cityName");
  let countryImg = document.getElementById("countryImg");
  let weatherDescription = document.getElementById("weatherDescription");
  let weatherImg = document.getElementById("weatherImg");
  let weatherTemparature = document.getElementById("weatherTemparature");
  let wind = document.getElementById("wind");
  let humidity = document.getElementById("humidity");
  let clouds = document.getElementById("clouds");

  cityName.innerText = response?.name;
  countryImg.src = `https://flagcdn.com/144x108/${response?.sys?.country.toLowerCase()}.png`;
  weatherDescription.innerText = response?.weather[0]?.description;
  weatherImg.src = `http://openweathermap.org/img/w/${response?.weather?.[0]?.icon}.png`;
  weatherTemparature.innerText = `${response?.main?.temp} °C`;
  wind.innerText = `${response?.wind?.speed} Km/h`;
  humidity.innerText = `${response?.main?.humidity} %`;
  clouds.innerText = `${response?.clouds?.all} %`;
}

let searchArea = document.getElementById("searchArea");
let searchBtn = document.getElementById("searchBtn");

searchBtn.addEventListener("click", (e) => {
  e.preventDefault();
  cityName = searchArea.value;

  if (cityName == "") {
    return;
  } else {
    fetchSearchWeatherInfo(cityName);
  }
});
async function fetchSearchWeatherInfo(cityName) {
  let response = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_KEY}&units=metric`
  ).then((response) => response.json());
  weatherBox.classList.add("active");
  render(response);
}
