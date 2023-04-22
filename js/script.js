const apiKey = "22a2a48d05ae9297e09f118308f99d21";
const search = document.querySelector("#user-input");
const searchBtn = document.querySelector("#search-button");
const mainCard = document.querySelector("#main-card-title");
const temp = document.querySelector("#main-card-temp");
const wind = document.querySelector("#main-card-wind");
const humidity = document.querySelector("#main-card-humidity");
const date = document.querySelector(".date");
let city = "";
const searchList = document.querySelector("#results-div");


searchBtn.addEventListener("click", function (event) {
    event.preventDefault()
    let city = search.value
    getWeather(city);
    localStorage.setItem("city", JSON.stringify(city));

    function getWeather(city) {
        fetch(`https://api.openweathermap.org/data/2.5/weather?q=` + city + `&appid=` + apiKey + `&units=imperial`)
            .then((res) => {
                return res.json()
            })
            .then((data) => {
                console.log(data)
                const today = new Date(data.dt * 1000)
                const month = today.getMonth() + 1;
                date.innerHTML = "(" + month + "/" + today.getDate() + "/" + today.getFullYear() + ")"
                mainCard.innerHTML = data.name

                const todaysPic = document.createElement("img")
                const weatherPic = data.weather[0].icon
                todaysPic.setAttribute("src", "https://openweathermap.org/img/wn/" + weatherPic + "@2x.png");
                todaysPic.setAttribute("alt", data.weather[0].description);
                mainCard.append(todaysPic)

                temp.innerHTML = "Temp: " + Math.floor(data.main.temp) + ` &#176F`
                wind.innerHTML = "Wind: " + Math.floor(data.wind.speed) + " mph"
                humidity.innerHTML = " Humidity: " + Math.floor(data.main.humidity) + "%";

                fetch(`https://api.openweathermap.org/data/2.5/forecast?q=` + city + `&appid=` + apiKey + `&units=imperial`)
                    .then((res) => {
                        return res.json()
                    })
                    .then((data) => {
                        console.log(data)
                        const forecastCards = document.querySelectorAll(".card-body")

                        // The for loop is so that each of the five cards gets this done but with its own data and with one set of code
                        for (let i = 0; i < forecastCards.length; i++) {
                            // iterates through the five cards to display the data for the respective dates
                            // leave the string empty so that when you do a new search, it doesn't add TO the cards; it'll replace the data with the new city's data
                            forecastCards[i].innerHTML = "";

                            // this api call displays the data every 3 hours; we to make it not do that
                            const index = i * 8 + 4;
                            const forecastDate = new Date(data.list[index].dt * 1000)

                            // Create element for date to display in 
                            // Write it to that element and append it to the DOM
                            const daysDate = document.createElement("p")
                            const month = forecastDate.getMonth() + 1;
                            daysDate.innerHTML = "(" + month + "/" + forecastDate.getDate() + "/" + forecastDate.getFullYear() + ")"
                            forecastCards[i].append(daysDate)

                            // Create element for open weather icon 
                            // Write it to that element and append it to the DOM
                            const forecastPic = document.createElement("img");
                            forecastPic.setAttribute("src", "https://openweathermap.org/img/wn/" + data.list[index].weather[0].icon + "@2x.png");
                            forecastPic.setAttribute("alt", data.list[index].weather[0].description);
                            forecastCards[i].append(forecastPic);

                            // Create elements for the weather data (three li's)
                            // Link them by their element's ID, write them and append them to the DOM
                            const forcastTemp = document.createElement("li")
                            forcastTemp.innerHTML = "Temp: " + Math.floor(data.list[index].main.temp) + ` &#176F`;
                            forecastCards[i].append(forcastTemp)
                            const forcastWind = document.createElement("li")
                            forcastWind.innerHTML = "Wind: " + Math.floor(data.list[index].wind.speed) + ` mph`;
                            forecastCards[i].append(forcastWind)
                            const forcastHumidity = document.createElement("li")
                            forcastHumidity.innerHTML = "Humidity: " + Math.floor(data.list[index].main.humidity) + `%`;
                            forecastCards[i].append(forcastHumidity)
                        }
                    })
            })
    }

    let recentBtn = document.getElementById('recentBtn');
    recentBtn.addEventListener('click', (event) => choiceClicked(event));


    let historyBtn = document.getElementById('historyBtn');
    historyBtn.addEventListener('click', clearStorage);


    recentBtn.innerHTML = '';
    
    let cityChoiceArray =
        JSON.parse(window.localStorage.getItem('previousCities')) || [];

    
    if (!cityChoiceArray.includes(city)) {
        
        cityChoiceArray.push(city);
        
        window.localStorage.setItem(
            'previousCities',
            JSON.stringify(cityChoiceArray)
        );
        
        for (let index = 0; index < cityChoiceArray.length; index++) {
            recentBtn.innerHTML += `
    <button class="d-grid pb-5 btn btn-outline-warning">${cityChoiceArray[index]}</button>
    `;
        }
    } else {
        for (let index = 0; index < cityChoiceArray.length; index++) {
            let recentBtn = document.getElementById('recentBtn');

            recentBtn.innerHTML += `
    <button class="d-grid pt-4 pb-5 btn btn-outline-warning">${cityChoiceArray[index]}</button>
    `;
        }
    }
    
    historyBtn.innerHTML = `
  <button class="d-grid pt-4 pb-5 btn btn-outline-secondary">Clear Recent</button>
  `;


    function clearStorage() {
        localStorage.clear();
        recentBtn.innerHTML = '';
        historyBtn.innerHTML = '';
    };


   
});