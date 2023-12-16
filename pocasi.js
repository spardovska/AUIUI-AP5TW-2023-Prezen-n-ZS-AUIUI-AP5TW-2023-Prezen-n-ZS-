
const apiKey = 'b494067b8d26370d71fe852b3d050099';
const search = document.getElementById('search');
const add = document.getElementById('add');
const addToFavoritesCheckbox = document.getElementById('addToFavorites');
const showFavoritesButton = document.getElementById('show-favorites');
const currentWeatherDiv = document.getElementById('current-weather');
const favoriteCitiesDiv = document.getElementById('favorite-cities');
const favoriteCities = [];

// Přidávání měst
add.addEventListener('click', () => {
    const city = search.value.trim();
    const addToFavorites = addToFavoritesCheckbox.checked;

    if (city) {
        fetchData(city, addToFavorites);
    } else {
        addMultipleCities();
    }
});

// Zobrazování oblíbených měst
showFavoritesButton.addEventListener('click', () => {
    displayFavoriteCities();
});

// Načtení  měst z localStorage při načítání stránky
document.addEventListener('DOMContentLoaded', () => {
    // Vymazání kódu pro načítání z localStorage

    const defaultCities = ['Prague', 'London', 'New York'];
    defaultCities.forEach(city => fetchData(city, addToFavoritesCheckbox.checked));
});

// Získání dat z API
async function fetchData(city, addToFavorites) {
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`);
    const data = await response.json();

    const weatherInfo = {
        city: data.name,
        temperature: convertKelvinToCelsius(data.main.temp),
        description: data.weather[0].description,
        addToFavorites: addToFavorites
    };

    setWeatherBackground(weatherInfo.description);
    displayWeatherInfo(weatherInfo);

    if (addToFavorites) {
        addFavoriteCity(weatherInfo);
    }
}



// Převod teploty z Kelvin na Celsius
function convertKelvinToCelsius(kelvin) {
    return Math.round(kelvin - 273.15);
}

// Překlad  počasí
function translateDescription(description) {
    const descriptionMap = {
        'clear sky': 'jasno',
        'few clouds': 'lehce oblačno',
        'scattered clouds': 'oblačno',
        'broken clouds': 'zataženo',
        'shower rain': 'přeháňka',
        'rain': 'dešť',
        'thunderstorm': 'bouřka',
        'snow': 'sníh',
        'mist': 'mlha',
        'overcast clouds': 'mračno',
    };
    return descriptionMap[description] || description;
}

// Zobrazení informací o počasí
function displayWeatherInfo(weatherInfo) {
    currentWeatherDiv.innerHTML = ''; // Vymazání předchozího obsahu

    const cityElement = document.createElement('p');
    cityElement.textContent = `Město: ${weatherInfo.city}`;

    const tempElement = document.createElement('p');
    tempElement.textContent = `Teplota: ${weatherInfo.temperature} °C`;

    const translatedDescription = translateDescription(weatherInfo.description);

    const descElement = document.createElement('p');
    descElement.textContent = `Popis: ${translatedDescription}`;

    currentWeatherDiv.appendChild(cityElement);
    currentWeatherDiv.appendChild(tempElement);
    currentWeatherDiv.appendChild(descElement);
}

// Nastavení pozadí podle popisu počasí 
function setWeatherBackground(description) {
    const body = document.body;
    body.className = ''; // Vymazání předchozích tříd

    const backgroundImages = {
        'clear sky': 'clear-sky-background.jpg',
        'few clouds': 'few-clouds-background.jpg',
        'scattered clouds': 'cloudy-background.jpg',
        'broken clouds': 'cloudy-background.jpg',
        'shower rain': 'rainy-background.jpg',
        'rain': 'rainy-background.jpg',
        'thunderstorm': 'thunderstorm-background.jpg',
        'snow': 'snow-background.jpg',
        'mist': 'mist-background.jpg',
        'overcast clouds': 'clouds.jpg',
    };

    const backgroundImage = backgroundImages[description];
    if (backgroundImage) {
        body.classList.add(description.replace(' ', '-'));
    }
}

// Zobrazení oblíbených měst
function displayFavoriteCities() {
    favoriteCitiesDiv.innerHTML = ''; 
    

    // Vymazání předchozího obsahu
    favoriteCities.forEach((city, index) => {
        const favoriteCityDiv = document.createElement('div');

        const cityElement = document.createElement('p');
        cityElement.textContent = `Město: ${city.city}`;

        const tempElement = document.createElement('p');
        tempElement.textContent = `Teplota: ${city.temperature} °C`;

        const translatedDescription = translateDescription(city.description);

        const descElement = document.createElement('p');
        descElement.textContent = `Popis: ${translatedDescription}`;

        const starIcon = document.createElement('span');
        starIcon.textContent = '⭐'; 
        starIcon.style.color = city.addToFavorites ? 'gold' : 'gray';

        const removeButton = document.createElement('button');
        removeButton.textContent = 'Odebrat';
        removeButton.addEventListener('click', () => removeFavoriteCity(index));

        favoriteCityDiv.appendChild(cityElement);
        favoriteCityDiv.appendChild(tempElement);
        favoriteCityDiv.appendChild(descElement);
        favoriteCityDiv.appendChild(starIcon);
        favoriteCityDiv.appendChild(removeButton);

        favoriteCitiesDiv.appendChild(favoriteCityDiv);
    });

    // Zobraz oblíbená města
    favoriteCitiesDiv.style.display = 'block';
    currentWeatherDiv.style.display = 'none';
}

// Přidání oblíbeného města
function addFavoriteCity(weatherInfo) {
    if (!favoriteCities.some(city => city.city === weatherInfo.city) && favoriteCities.length < 3) {
        favoriteCities.push(weatherInfo);
    }
}

// Odebrání oblíbeného města
function removeFavoriteCity(index) {
    favoriteCities.splice(index, 1);
    displayFavoriteCities();
}
const closeFavoritesButton = document.getElementById('close-favorites');

// Přidání event listeneru pro tlačítko "Zavřít oblíbená města"
closeFavoritesButton.addEventListener('click', () => {
    closeFavoriteCities();
});

// Funkce pro zavření oblíbených měst a zobrazení aktuálního počasí
function closeFavoriteCities() {
    favoriteCitiesDiv.style.display = 'none';
    currentWeatherDiv.style.display = 'block';
}
document.addEventListener('DOMContentLoaded', () => {
    const defaultFavoriteCity = 'Paris'; 
    fetchData(defaultFavoriteCity, true); // Zavoláme fetchData s addToFavorites=true
});