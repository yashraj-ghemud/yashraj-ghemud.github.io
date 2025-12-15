/* ============================================
   WeatherWise - JavaScript Functionality
   ============================================ */

// API Configuration
const API_KEY = 'c03a802ccfed89a203ab57d8f84ad0f1'; // Replace with your OpenWeatherMap API key
const BASE_URL = 'https://api.openweathermap.org/data/2.5';
const GEO_URL = 'https://api.openweathermap.org/geo/1.0';

// DOM Elements
const elements = {
    // Search
    cityInput: document.getElementById('cityInput'),
    searchBtn: document.getElementById('searchBtn'),
    clearBtn: document.getElementById('clearBtn'),
    getLocationBtn: document.getElementById('getLocationBtn'),
    recentSearches: document.getElementById('recentSearches'),
    recentList: document.getElementById('recentList'),

    // Theme & Units
    themeToggle: document.getElementById('themeToggle'),
    unitToggle: document.getElementById('unitToggle'),

    // Containers
    loader: document.getElementById('loader'),
    errorContainer: document.getElementById('errorContainer'),
    errorMessage: document.getElementById('errorMessage'),
    retryBtn: document.getElementById('retryBtn'),
    weatherMain: document.getElementById('weatherMain'),

    // Current Weather
    cityName: document.getElementById('cityName'),
    dateTime: document.getElementById('dateTime'),
    weatherBadge: document.getElementById('weatherBadge'),
    weatherIcon: document.getElementById('weatherIcon'),
    tempValue: document.getElementById('tempValue'),
    tempUnit: document.getElementById('tempUnit'),
    feelsLike: document.getElementById('feelsLike'),
    weatherDesc: document.getElementById('weatherDesc'),
    tempMax: document.getElementById('tempMax'),
    tempMin: document.getElementById('tempMin'),

    // Weather Details
    humidity: document.getElementById('humidity'),
    humidityBar: document.getElementById('humidityBar'),
    windSpeed: document.getElementById('windSpeed'),
    windArrow: document.getElementById('windArrow'),
    windDir: document.getElementById('windDir'),
    pressure: document.getElementById('pressure'),
    visibility: document.getElementById('visibility'),
    sunrise: document.getElementById('sunrise'),
    sunset: document.getElementById('sunset'),
    clouds: document.getElementById('clouds'),
    uvIndex: document.getElementById('uvIndex'),

    // Forecast
    forecastContainer: document.getElementById('forecastContainer'),
    hourlyContainer: document.getElementById('hourlyContainer'),
    scrollLeft: document.getElementById('scrollLeft'),
    scrollRight: document.getElementById('scrollRight'),

    // Air Quality
    aqiCircle: document.getElementById('aqiCircle'),
    aqiValue: document.getElementById('aqiValue'),
    aqiLevel: document.getElementById('aqiLevel'),
    aqiMessage: document.getElementById('aqiMessage'),
    pollutantsGrid: document.getElementById('pollutantsGrid'),

    // Background Effects
    stars: document.getElementById('stars'),
    rain: document.getElementById('rain'),
    snow: document.getElementById('snow'),

    // Footer
    lastUpdate: document.getElementById('lastUpdate'),

    // Toast
    toast: document.getElementById('toast'),
    toastMessage: document.getElementById('toastMessage')
};

// State Management
let state = {
    currentCity: '',
    currentData: null,
    isCelsius: true,
    isDarkTheme: true,
    recentSearches: [],
    lastSearchedCity: ''
};

// ============================================
// Initialization
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
});

function initializeApp() {
    loadFromLocalStorage();
    setupEventListeners();
    applyTheme();
    displayRecentSearches();
    createBackgroundEffects();

    // Check if there's a last searched city
    if (state.lastSearchedCity) {
        searchWeather(state.lastSearchedCity);
    }
}

function loadFromLocalStorage() {
    const savedTheme = localStorage.getItem('weatherTheme');
    const savedUnit = localStorage.getItem('weatherUnit');
    const savedSearches = localStorage.getItem('recentSearches');
    const lastCity = localStorage.getItem('lastCity');

    if (savedTheme) state.isDarkTheme = savedTheme === 'dark';
    if (savedUnit) state.isCelsius = savedUnit === 'celsius';
    if (savedSearches) state.recentSearches = JSON.parse(savedSearches);
    if (lastCity) state.lastSearchedCity = lastCity;

    // Update unit toggle button text
    elements.unitToggle.textContent = state.isCelsius ? '°C' : '°F';
}

function saveToLocalStorage() {
    localStorage.setItem('weatherTheme', state.isDarkTheme ? 'dark' : 'light');
    localStorage.setItem('weatherUnit', state.isCelsius ? 'celsius' : 'fahrenheit');
    localStorage.setItem('recentSearches', JSON.stringify(state.recentSearches));
    localStorage.setItem('lastCity', state.currentCity);
}

// ============================================
// Event Listeners
// ============================================
function setupEventListeners() {
    // Search Events
    elements.searchBtn.addEventListener('click', handleSearch);
    elements.cityInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleSearch();
    });
    elements.clearBtn.addEventListener('click', clearInput);
    elements.retryBtn.addEventListener('click', () => {
        if (state.lastSearchedCity) {
            searchWeather(state.lastSearchedCity);
        }
    });

    // Location
    elements.getLocationBtn.addEventListener('click', getCurrentLocation);

    // Theme & Unit Toggle
    elements.themeToggle.addEventListener('click', toggleTheme);
    elements.unitToggle.addEventListener('click', toggleUnit);

    // Hourly Scroll
    elements.scrollLeft.addEventListener('click', () => scrollHourly('left'));
    elements.scrollRight.addEventListener('click', () => scrollHourly('right'));

    // Input focus effects
    elements.cityInput.addEventListener('focus', () => {
        elements.cityInput.parentElement.classList.add('focused');
    });
    elements.cityInput.addEventListener('blur', () => {
        elements.cityInput.parentElement.classList.remove('focused');
    });
}

// ============================================
// Search Functionality
// ============================================
function handleSearch() {
    const city = elements.cityInput.value.trim();
    if (city) {
        state.lastSearchedCity = city;
        searchWeather(city);
    } else {
        showError('Please enter a city name');
    }
}

function clearInput() {
    elements.cityInput.value = '';
    elements.cityInput.focus();
}

async function searchWeather(city) {
    showLoader();
    hideError();
    hideWeatherData();

    try {
        // Get coordinates first
        const geoData = await fetchGeoData(city);
        if (!geoData || geoData.length === 0) {
            throw new Error('City not found. Please check the spelling and try again.');
        }

        const { lat, lon, name, country, state: region } = geoData[0];
        state.currentCity = region ? `${name}, ${region}, ${country}` : `${name}, ${country}`;

        // Fetch all weather data in parallel
        const [currentWeather, forecast, airQuality] = await Promise.all([
            fetchCurrentWeather(lat, lon),
            fetchForecast(lat, lon),
            fetchAirQuality(lat, lon)
        ]);

        state.currentData = {
            current: currentWeather,
            forecast: forecast,
            airQuality: airQuality,
            lat,
            lon
        };

        // Update UI
        displayCurrentWeather(currentWeather);
        displayForecast(forecast);
        displayHourlyForecast(forecast);
        displayAirQuality(airQuality);
        updateBackgroundTheme(currentWeather);

        // Save to recent searches
        addToRecentSearches(city);
        saveToLocalStorage();

        hideLoader();
        showWeatherData();
        showToast(`Weather data loaded for ${state.currentCity}`);

    } catch (error) {
        hideLoader();
        showError(error.message);
        console.error('Weather fetch error:', error);
    }
}

// ============================================
// API Calls
// ============================================
async function fetchGeoData(city) {
    const response = await fetch(
        `${GEO_URL}/direct?q=${encodeURIComponent(city)}&limit=1&appid=${API_KEY}`
    );

    if (!response.ok) {
        if (response.status === 401) {
            throw new Error('Invalid API key. Please check your OpenWeatherMap API key in script.js. Note: New API keys can take up to 2 hours to activate.');
        }
        throw new Error('Failed to fetch location data. Please try again.');
    }

    return response.json();
}

async function fetchCurrentWeather(lat, lon) {
    const response = await fetch(
        `${BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
    );

    if (!response.ok) {
        if (response.status === 401) {
            throw new Error('Invalid API key. Please check your OpenWeatherMap API key in script.js. Note: New API keys can take up to 2 hours to activate.');
        }
        throw new Error('Failed to fetch weather data. Please try again.');
    }

    return response.json();
}

async function fetchForecast(lat, lon) {
    const response = await fetch(
        `${BASE_URL}/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
    );

    if (!response.ok) {
        if (response.status === 401) {
            throw new Error('Invalid API key. Please check your OpenWeatherMap API key in script.js. Note: New API keys can take up to 2 hours to activate.');
        }
        throw new Error('Failed to fetch forecast data. Please try again.');
    }

    return response.json();
}

async function fetchAirQuality(lat, lon) {
    const response = await fetch(
        `${BASE_URL}/air_pollution?lat=${lat}&lon=${lon}&appid=${API_KEY}`
    );

    if (!response.ok) {
        return null; // Air quality is optional
    }

    return response.json();
}

// ============================================
// Geolocation
// ============================================
function getCurrentLocation() {
    if (!navigator.geolocation) {
        showError('Geolocation is not supported by your browser.');
        return;
    }

    showLoader();
    showToast('Getting your location...');

    navigator.geolocation.getCurrentPosition(
        async (position) => {
            const { latitude, longitude } = position.coords;

            try {
                // Reverse geocode to get city name
                const response = await fetch(
                    `${GEO_URL}/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=${API_KEY}`
                );

                const data = await response.json();
                if (data && data.length > 0) {
                    const cityName = data[0].name;
                    elements.cityInput.value = cityName;
                    state.lastSearchedCity = cityName;
                    searchWeather(cityName);
                }
            } catch (error) {
                hideLoader();
                showError('Could not determine your location. Please enter a city manually.');
            }
        },
        (error) => {
            hideLoader();
            switch (error.code) {
                case error.PERMISSION_DENIED:
                    showError('Location access denied. Please enable location services.');
                    break;
                case error.POSITION_UNAVAILABLE:
                    showError('Location information unavailable.');
                    break;
                case error.TIMEOUT:
                    showError('Location request timed out. Please try again.');
                    break;
                default:
                    showError('An unknown error occurred.');
            }
        }
    );
}

// ============================================
// Display Functions
// ============================================
function displayCurrentWeather(data) {
    const temp = convertTemperature(data.main.temp);
    const feelsLike = convertTemperature(data.main.feels_like);
    const tempMax = convertTemperature(data.main.temp_max);
    const tempMin = convertTemperature(data.main.temp_min);

    // City Name
    elements.cityName.querySelector('span').textContent = state.currentCity;

    // Date & Time
    const now = new Date();
    elements.dateTime.textContent = formatDateTime(now);

    // Weather Badge
    elements.weatherBadge.querySelector('span').textContent = data.weather[0].main;

    // Weather Icon
    const iconCode = data.weather[0].icon;
    elements.weatherIcon.src = `https://openweathermap.org/img/wn/${iconCode}@4x.png`;
    elements.weatherIcon.alt = data.weather[0].description;

    // Temperature
    elements.tempValue.textContent = Math.round(temp);
    elements.tempUnit.textContent = state.isCelsius ? '°C' : '°F';
    elements.feelsLike.textContent = Math.round(feelsLike);

    // Description
    elements.weatherDesc.textContent = capitalizeWords(data.weather[0].description);

    // Temperature Range
    elements.tempMax.textContent = Math.round(tempMax);
    elements.tempMin.textContent = Math.round(tempMin);

    // Weather Details
    elements.humidity.textContent = data.main.humidity;
    elements.humidityBar.style.width = `${data.main.humidity}%`;

    const windSpeed = state.isCelsius ?
        (data.wind.speed * 3.6).toFixed(1) :
        (data.wind.speed * 2.237).toFixed(1);
    elements.windSpeed.textContent = windSpeed;

    // Wind Direction
    const windDeg = data.wind.deg || 0;
    elements.windArrow.style.transform = `rotate(${windDeg}deg)`;
    elements.windDir.textContent = getWindDirection(windDeg);

    elements.pressure.textContent = data.main.pressure;
    elements.visibility.textContent = (data.visibility / 1000).toFixed(1);

    // Sunrise & Sunset
    const timezone = data.timezone;
    elements.sunrise.textContent = formatTime(data.sys.sunrise, timezone);
    elements.sunset.textContent = formatTime(data.sys.sunset, timezone);

    elements.clouds.textContent = data.clouds.all;

    // UV Index (requires additional API call or estimate)
    estimateUVIndex(data);

    // Update last update time
    elements.lastUpdate.textContent = formatTime(Date.now() / 1000);
}

function displayForecast(data) {
    elements.forecastContainer.innerHTML = '';

    // Get daily forecasts (one per day at noon)
    const dailyForecasts = getDailyForecasts(data.list);

    dailyForecasts.forEach((day, index) => {
        const temp = convertTemperature(day.main.temp);
        const tempMax = convertTemperature(day.main.temp_max);
        const tempMin = convertTemperature(day.main.temp_min);
        const date = new Date(day.dt * 1000);

        const card = document.createElement('div');
        card.className = 'forecast-card';
        card.style.animationDelay = `${index * 0.1}s`;

        card.innerHTML = `
            <div class="forecast-day">${index === 0 ? 'Tomorrow' : formatDayName(date)}</div>
            <div class="forecast-date">${formatShortDate(date)}</div>
            <img src="https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png" 
                 alt="${day.weather[0].description}" 
                 class="forecast-icon">
            <div class="forecast-temp">
                <span class="high">${Math.round(tempMax)}°</span>
                <span class="low">${Math.round(tempMin)}°</span>
            </div>
            <div class="forecast-desc">${day.weather[0].description}</div>
        `;

        elements.forecastContainer.appendChild(card);
    });
}

function displayHourlyForecast(data) {
    elements.hourlyContainer.innerHTML = '';

    // Get next 24 hours (8 entries at 3-hour intervals)
    const hourlyData = data.list.slice(0, 8);

    hourlyData.forEach((hour, index) => {
        const temp = convertTemperature(hour.main.temp);
        const time = new Date(hour.dt * 1000);

        const card = document.createElement('div');
        card.className = `hourly-card ${index === 0 ? 'now' : ''}`;

        card.innerHTML = `
            <div class="hourly-time">${index === 0 ? 'Now' : formatHourTime(time)}</div>
            <img src="https://openweathermap.org/img/wn/${hour.weather[0].icon}@2x.png" 
                 alt="${hour.weather[0].description}" 
                 class="hourly-icon">
            <div class="hourly-temp">${Math.round(temp)}°</div>
        `;

        elements.hourlyContainer.appendChild(card);
    });
}

function displayAirQuality(data) {
    if (!data || !data.list || data.list.length === 0) {
        elements.aqiValue.textContent = 'N/A';
        elements.aqiLevel.textContent = 'No data';
        elements.aqiMessage.textContent = 'Air quality data is not available for this location.';
        elements.pollutantsGrid.innerHTML = '';
        return;
    }

    const aqi = data.list[0].main.aqi;
    const components = data.list[0].components;

    // Update AQI display
    elements.aqiValue.textContent = aqi;

    // AQI level and color
    const aqiInfo = getAQIInfo(aqi);
    elements.aqiLevel.textContent = aqiInfo.level;
    elements.aqiMessage.textContent = aqiInfo.message;
    elements.aqiCircle.className = `aqi-circle ${aqiInfo.class}`;

    // Pollutants grid
    elements.pollutantsGrid.innerHTML = '';

    const pollutants = [
        { name: 'PM2.5', value: components.pm2_5?.toFixed(1), unit: 'μg/m³' },
        { name: 'PM10', value: components.pm10?.toFixed(1), unit: 'μg/m³' },
        { name: 'O₃', value: components.o3?.toFixed(1), unit: 'μg/m³' },
        { name: 'NO₂', value: components.no2?.toFixed(1), unit: 'μg/m³' },
        { name: 'SO₂', value: components.so2?.toFixed(1), unit: 'μg/m³' },
        { name: 'CO', value: components.co?.toFixed(1), unit: 'μg/m³' }
    ];

    pollutants.forEach(pollutant => {
        if (pollutant.value) {
            const item = document.createElement('div');
            item.className = 'pollutant-item';
            item.innerHTML = `
                <div class="pollutant-name">${pollutant.name}</div>
                <div class="pollutant-value">${pollutant.value}</div>
                <div class="pollutant-unit">${pollutant.unit}</div>
            `;
            elements.pollutantsGrid.appendChild(item);
        }
    });
}

function getAQIInfo(aqi) {
    const info = {
        1: { level: 'Good', message: 'Air quality is satisfactory. Enjoy outdoor activities!', class: 'aqi-good' },
        2: { level: 'Fair', message: 'Air quality is acceptable. Sensitive groups should limit prolonged outdoor exposure.', class: 'aqi-fair' },
        3: { level: 'Moderate', message: 'Members of sensitive groups may experience health effects.', class: 'aqi-moderate' },
        4: { level: 'Poor', message: 'Everyone may begin to experience health effects.', class: 'aqi-poor' },
        5: { level: 'Very Poor', message: 'Health alert: The risk of health effects is increased for everyone.', class: 'aqi-very-poor' }
    };

    return info[aqi] || info[1];
}

// ============================================
// Background Theme
// ============================================
function updateBackgroundTheme(data) {
    const weatherMain = data.weather[0].main.toLowerCase();
    const icon = data.weather[0].icon;
    const isNight = icon.includes('n');

    // Remove all weather classes
    document.body.classList.remove('sunny', 'cloudy', 'rainy', 'snowy', 'night', 'thunderstorm');

    // Hide all effects
    elements.stars.style.display = 'none';
    elements.rain.style.display = 'none';
    elements.snow.style.display = 'none';

    if (isNight) {
        document.body.classList.add('night');
        elements.stars.style.display = 'block';
    } else if (weatherMain.includes('thunder')) {
        document.body.classList.add('thunderstorm');
        elements.rain.style.display = 'block';
    } else if (weatherMain.includes('rain') || weatherMain.includes('drizzle')) {
        document.body.classList.add('rainy');
        elements.rain.style.display = 'block';
    } else if (weatherMain.includes('snow')) {
        document.body.classList.add('snowy');
        elements.snow.style.display = 'block';
    } else if (weatherMain.includes('cloud') || weatherMain.includes('mist') || weatherMain.includes('fog')) {
        document.body.classList.add('cloudy');
    } else {
        document.body.classList.add('sunny');
    }
}

function createBackgroundEffects() {
    // Create stars
    for (let i = 0; i < 100; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        star.style.left = `${Math.random() * 100}%`;
        star.style.top = `${Math.random() * 100}%`;
        star.style.animationDelay = `${Math.random() * 2}s`;
        star.style.animationDuration = `${1 + Math.random() * 2}s`;
        elements.stars.appendChild(star);
    }

    // Create raindrops
    for (let i = 0; i < 100; i++) {
        const drop = document.createElement('div');
        drop.className = 'raindrop';
        drop.style.left = `${Math.random() * 100}%`;
        drop.style.animationDuration = `${0.5 + Math.random() * 0.5}s`;
        drop.style.animationDelay = `${Math.random() * 2}s`;
        elements.rain.appendChild(drop);
    }

    // Create snowflakes
    for (let i = 0; i < 50; i++) {
        const flake = document.createElement('div');
        flake.className = 'snowflake';
        flake.style.left = `${Math.random() * 100}%`;
        flake.style.width = `${5 + Math.random() * 10}px`;
        flake.style.height = flake.style.width;
        flake.style.animationDuration = `${3 + Math.random() * 5}s`;
        flake.style.animationDelay = `${Math.random() * 5}s`;
        elements.snow.appendChild(flake);
    }
}

// ============================================
// Theme Toggle
// ============================================
function toggleTheme() {
    state.isDarkTheme = !state.isDarkTheme;
    applyTheme();
    saveToLocalStorage();

    const icon = elements.themeToggle.querySelector('i');
    icon.classList.toggle('fa-moon');
    icon.classList.toggle('fa-sun');
}

function applyTheme() {
    if (state.isDarkTheme) {
        document.documentElement.setAttribute('data-theme', 'dark');
        elements.themeToggle.querySelector('i').classList.replace('fa-moon', 'fa-sun');
    } else {
        document.documentElement.removeAttribute('data-theme');
        elements.themeToggle.querySelector('i').classList.replace('fa-sun', 'fa-moon');
    }
}

// ============================================
// Unit Toggle
// ============================================
function toggleUnit() {
    state.isCelsius = !state.isCelsius;
    elements.unitToggle.textContent = state.isCelsius ? '°C' : '°F';
    saveToLocalStorage();

    // Refresh display if we have data
    if (state.currentData) {
        displayCurrentWeather(state.currentData.current);
        displayForecast(state.currentData.forecast);
        displayHourlyForecast(state.currentData.forecast);
    }

    showToast(`Temperature unit changed to ${state.isCelsius ? 'Celsius' : 'Fahrenheit'}`);
}

function convertTemperature(celsius) {
    return state.isCelsius ? celsius : (celsius * 9 / 5) + 32;
}

// ============================================
// Recent Searches
// ============================================
function addToRecentSearches(city) {
    // Remove if already exists
    const index = state.recentSearches.findIndex(
        s => s.toLowerCase() === city.toLowerCase()
    );
    if (index !== -1) {
        state.recentSearches.splice(index, 1);
    }

    // Add to beginning
    state.recentSearches.unshift(city);

    // Keep only last 5
    if (state.recentSearches.length > 5) {
        state.recentSearches.pop();
    }

    displayRecentSearches();
}

function displayRecentSearches() {
    if (state.recentSearches.length === 0) {
        elements.recentSearches.classList.remove('show');
        return;
    }

    elements.recentSearches.classList.add('show');
    elements.recentList.innerHTML = '';

    state.recentSearches.forEach(city => {
        const btn = document.createElement('button');
        btn.className = 'recent-item';
        btn.textContent = city;
        btn.addEventListener('click', () => {
            elements.cityInput.value = city;
            searchWeather(city);
        });
        elements.recentList.appendChild(btn);
    });
}

// ============================================
// Hourly Scroll
// ============================================
function scrollHourly(direction) {
    const scrollAmount = 220;
    const container = elements.hourlyContainer;

    if (direction === 'left') {
        container.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    } else {
        container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
}

// ============================================
// Helper Functions
// ============================================
function formatDateTime(date) {
    const options = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    };
    return date.toLocaleDateString('en-US', options);
}

function formatTime(timestamp, timezoneOffset = 0) {
    const date = new Date((timestamp + timezoneOffset) * 1000);
    return date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    });
}

function formatDayName(date) {
    return date.toLocaleDateString('en-US', { weekday: 'long' });
}

function formatShortDate(date) {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function formatHourTime(date) {
    return date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        hour12: true
    });
}

function capitalizeWords(str) {
    return str.replace(/\b\w/g, char => char.toUpperCase());
}

function getWindDirection(degrees) {
    const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE',
        'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
    const index = Math.round(degrees / 22.5) % 16;
    return directions[index];
}

function getDailyForecasts(list) {
    const daily = [];
    const seen = new Set();

    // Skip first day (today) and get one forecast per day around noon
    for (const item of list) {
        const date = new Date(item.dt * 1000);
        const dateKey = date.toDateString();

        // Skip today
        if (dateKey === new Date().toDateString()) continue;

        // Get forecast around noon (12:00)
        const hour = date.getHours();
        if (!seen.has(dateKey) && hour >= 11 && hour <= 14) {
            seen.add(dateKey);
            daily.push(item);
        }

        if (daily.length >= 5) break;
    }

    // If we didn't get enough, fill with first entry of each remaining day
    if (daily.length < 5) {
        for (const item of list) {
            const date = new Date(item.dt * 1000);
            const dateKey = date.toDateString();

            if (dateKey === new Date().toDateString()) continue;

            if (!seen.has(dateKey)) {
                seen.add(dateKey);
                daily.push(item);
            }

            if (daily.length >= 5) break;
        }
    }

    return daily;
}

function estimateUVIndex(data) {
    // Estimate UV index based on cloud cover and time
    const clouds = data.clouds.all;
    const now = new Date();
    const hour = now.getHours();

    let baseUV = 0;

    // Peak UV hours (10 AM - 4 PM)
    if (hour >= 10 && hour <= 16) {
        baseUV = 6;
        if (hour >= 11 && hour <= 15) baseUV = 8;
        if (hour >= 12 && hour <= 14) baseUV = 10;
    } else if (hour >= 7 && hour < 10 || hour > 16 && hour <= 19) {
        baseUV = 3;
    }

    // Reduce based on cloud cover
    const cloudFactor = 1 - (clouds / 100) * 0.75;
    const estimatedUV = Math.round(baseUV * cloudFactor);

    elements.uvIndex.textContent = estimatedUV;

    // Add color indicator
    if (estimatedUV <= 2) {
        elements.uvIndex.className = 'detail-value uv-low';
    } else if (estimatedUV <= 5) {
        elements.uvIndex.className = 'detail-value uv-moderate';
    } else if (estimatedUV <= 7) {
        elements.uvIndex.className = 'detail-value uv-high';
    } else {
        elements.uvIndex.className = 'detail-value uv-very-high';
    }
}

// ============================================
// UI State Functions
// ============================================
function showLoader() {
    elements.loader.classList.add('show');
}

function hideLoader() {
    elements.loader.classList.remove('show');
}

function showError(message) {
    elements.errorMessage.textContent = message;
    elements.errorContainer.classList.add('show');
}

function hideError() {
    elements.errorContainer.classList.remove('show');
}

function showWeatherData() {
    elements.weatherMain.classList.add('show');
}

function hideWeatherData() {
    elements.weatherMain.classList.remove('show');
}

function showToast(message, isError = false) {
    elements.toastMessage.textContent = message;
    elements.toast.classList.toggle('error', isError);

    const icon = elements.toast.querySelector('i');
    icon.className = isError ? 'fas fa-exclamation-circle' : 'fas fa-check-circle';

    elements.toast.classList.add('show');

    setTimeout(() => {
        elements.toast.classList.remove('show');
    }, 3000);
}

// ============================================
// Keyboard Shortcuts
// ============================================
document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + K to focus search
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        elements.cityInput.focus();
        elements.cityInput.select();
    }

    // Escape to clear input
    if (e.key === 'Escape' && document.activeElement === elements.cityInput) {
        clearInput();
        elements.cityInput.blur();
    }

    // T to toggle theme
    if (e.key === 't' && document.activeElement !== elements.cityInput) {
        toggleTheme();
    }

    // U to toggle unit
    if (e.key === 'u' && document.activeElement !== elements.cityInput) {
        toggleUnit();
    }

    // L to get location
    if (e.key === 'l' && document.activeElement !== elements.cityInput) {
        getCurrentLocation();
    }
});

// ============================================
// Service Worker Registration (PWA Support)
// ============================================
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('ServiceWorker registered:', registration);
            })
            .catch(error => {
                console.log('ServiceWorker registration failed:', error);
            });
    });
}

// ============================================
// Export for testing (if needed)
// ============================================
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        convertTemperature,
        getWindDirection,
        capitalizeWords,
        getAQIInfo
    };
}
