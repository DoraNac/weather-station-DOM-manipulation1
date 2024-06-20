//FETCHING WEATHER API DATA 

async function fetchWeather(city) {
  try {
    const geoUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
      city
    )}`;
    const geoResponse = await fetch(geoUrl);
    if (!geoResponse.ok) {
      throw new Error("Geocoding failed.");
    }
    const geoData = await geoResponse.json();
    if (!geoData || geoData.length === 0) {
      throw new Error("Geocoding failed: No data returned.");
    }
    const latitude = geoData[0].lat;
    const longitude = geoData[0].lon;

    const apiUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=temperature_2m_max,temperature_2m_min,precipitation_sum&forecast_days=5`;

    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error("Weather data not found.");
    }
    const weatherData = await response.json();
    console.log(weatherData);
    return weatherData;
  } catch (error) {
    console.error("Error fetching weather data:", error);
    return null;
  }
}


// DISPLAY TODAY AND FOUR DAYS WEATHER

function displayWeather(weatherData) {
  const todaysWeatherDiv = document.querySelector(".todaysWeather");
  const fourDaysDiv = document.querySelector(".fourDays");

    let html = `<div class='weatherCard'>`;
  html += "<h2>Today:</h2>";
  html += `<p>Temperature: ${weatherData.daily.temperature_2m_max[0]}°C / ${weatherData.daily.temperature_2m_min[0]}°C</p>`;
  html += `<p>Precipitation: ${weatherData.daily.precipitation_sum[0]} mm</p>`;
  html += "</div>";

  todaysWeatherDiv.innerHTML = html;

  html = "";
  const timeArray = weatherData.daily.time;
  for (let i = 1; i <= 4; i++) {
    const dateString = timeArray[i];
    const date = new Date(dateString);
    html += `<div class='weatherCard'>`;
    html += `<h2> ${date.toISOString().split("T")[0]}:</h2>`;
    html += `<p>Temperature: ${weatherData.daily.temperature_2m_max[i]}°C / ${weatherData.daily.temperature_2m_min[i]}°C</p>`;
    html += `<p>Precipitation: ${weatherData.daily.precipitation_sum[i]} mm</p>`;
    html += "</div>";
  }

  fourDaysDiv.innerHTML = html;
}

// TRIGGER WEATHER DATA AND DISPLAY

document.getElementById("submitButton").addEventListener("click", async () => {
  const cityInput = document.getElementById("cityInput").value;
  if (cityInput.trim() !== "") {
    const weatherData = await fetchWeather(cityInput);
    if (weatherData) {
      displayWeather(weatherData);
    } else {
      console.error("Weather data not available.");
    }
  }
});
