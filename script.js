// const API_key = "168771779c71f3d64106d8a88376808a";

// async function featchWeatherDetails() {
//     let city = "goa";
//     let lat = 15.3333;
//     let lon = 74.0833;
//     const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_key}&units=metric`);
//     const data = await response.json();

//     console.log("Weather : -> " ,  data);

//     let newPara = document.createElement('p');
//     newPara.textContent = `${data?.main?.temp.toFixed(2)} °C`;

//     document.body.appendChild(newPara);
// }

// function getLocation() {
//     if(navigator.geolocation) {
//         navigator.geolocation.getCurrentPosition(showPosition);
//     }
//     else {
//         console.log("No Location found");
//     }
// }

// function showPosition(postion) {
//     let lat = postion.coords.latitude;
//     let longi = postion.coords.longitude;

//     console.log(lat);
//     console.log(longi);
// }




const userTab = document.querySelector("[data-userWeather]");
const searchTab = document.querySelector("[data-userSearch]");
const userContainer = document.querySelector(".weatherContainer");

const grantAcessesContainer = document.querySelector(".grantAcesses-Container");
const searchForm = document.querySelector("[data-SearchForm]");
const loadingScreen = document.querySelector(".loading-container");
const userInfoContainer = document.querySelector(".user-info-container");


const API_KEY = "168771779c71f3d64106d8a88376808a";
let currentTab = userTab;
currentTab.classList.add("current-tab");
getFromSessionStorage();


function switchTab(clickedTab) {
    if(clickedTab != currentTab) {
        currentTab.classList.remove("current-tab");
        currentTab = clickedTab;
        currentTab.classList.add("current-tab");

        if(!searchForm.classList.contains("active")) {
            userInfoContainer.classList.remove("active");
            grantAcessesContainer.classList.remove("active");
            searchForm.classList.add("active");
        }
        else {
            searchForm.classList.remove("active");
            userInfoContainer.classList.remove("active");
            // ab me your weather tab me aa gaya hu toh weather bhi display krna pdega , let's check local
            // storage first and get the coordinates , if we have saved it there
            getFromSessionStorage();
        }
    }
}

userTab.addEventListener("click" , () => {
    switchTab(userTab);
});

searchTab.addEventListener("click" , () => {
    switchTab(searchTab);
});

function getFromSessionStorage() {
    const localCoordinates = sessionStorage.getItem("user-coordinates");
    if(!localCoordinates) {
        // if we don't have any saved coordinates , let's get the user's location
        grantAcessesContainer.classList.add("active");
    }
    else {
        const coordinates = JSON.parse(localCoordinates);
        featchUserWeatherInfo(coordinates);
    }
}

async function featchUserWeatherInfo(coordinates) {
    const {lat , lon} = coordinates;
    // Make grant container invisible
    grantAcessesContainer.classList.remove("active");
    // make loader visible
    loadingScreen.classList.add("active");

    // API CALL
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);
        const data = await response.json();

        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");

        // Jo values aai h data se use dynamically show krega 
        renderWeatherInfo(data);
    }
    catch(err) {
        loadingScreen.classList.remove("active");
        // HW
    }
};

function renderWeatherInfo(weatherInfo) {
    // firstly we have to fetch the elements
    const cityName = document.querySelector("[data-cityName]");
    const countryIcon = document.querySelector("[data-countryIcon]");
    const desc = document.querySelector("[data-weatherDesc]");
    const weatherIcon = document.querySelector("[data-WeatherIcon]");
    const temp = document.querySelector("[data-temp]");
    const windSpeed = document.querySelector("[data-windspeed]");
    const humidity = document.querySelector("[data-humidity]");
    const cloudiness = document.querySelector("[data-cloudiness]");

    cityName.innerText = weatherInfo?.name;
    countryIcon.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
    desc.innerText = weatherInfo?.weather?.[0]?.description;
    weatherIcon.src = `http://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
    temp.innerText = weatherInfo?.main?.temp;
    windSpeed.innerText = weatherInfo?.wind?.speed;
    humidity.innerText = weatherInfo?.main?.humidity;
    cloudiness.innerText = weatherInfo?.clouds?.all;
}

function getLocation() {
    if(navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    }
    else {
        // HW - show an alert for no geolocation support available
    }
}

function showPosition(position) {
    const userCoordinates = {
        lat:position.coords.latitude,
        lon:position.coords.longitude,
    }

    sessionStorage.setItem("user-coordinates" , JSON.stringify(userCoordinates));
    featchUserWeatherInfo(userCoordinates);
}


const grantAcessesBtn = document.querySelector("[data-grantAcesses]");
grantAcessesBtn.addEventListener("click" , getLocation);

const searchInput = document.querySelector("[data-searchInput]");
searchForm.addEventListener("submit" , (event) => {
    event.preventDefault();
    let city = searchInput.value;
    if(city === "") {
        return;
    }
    else {
        featchSearchWeatherInfo(city);
    }
});

async function featchSearchWeatherInfo(city) {
    loadingScreen.classList.add("active");
    userInfoContainer.classList.remove("active");
    grantAcessesContainer.classList.remove("active");

    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);
        const data = await response.json();
        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        renderWeatherInfo(data);
    }
    catch(err) {
        // HW
    }
}
