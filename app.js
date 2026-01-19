document.addEventListener("DOMContentLoaded", function () {
  const API_KEY = "c04143a6fe809150b634bd542c5cdfaf";
  const body = document.body;
  const rainOverlay = document.querySelector(".rain-overlay");

  const cityInput = document.getElementById("city-input");
  const searchBtn = document.getElementById("search-btn");
  const quickCityButtons = document.querySelectorAll(".quick-city");

  const cityNameEl = document.getElementById("city-name");
  const weatherDescEl = document.getElementById("weather-desc");
  const weatherEmojiEl = document.getElementById("weather-emoji");
  const tempValueEl = document.getElementById("temp-value");
  const feelsLikeEl = document.getElementById("feels-like");
  const humidityEl = document.getElementById("humidity");
  const windEl = document.getElementById("wind");
  const statusLineEl = document.getElementById("status-line");
  const weatherCard = document.getElementById("weather-card");



  const themeClasses = [
    "weather-clear",
    "weather-clouds",
    "weather-rain",
    "weather-snow",
    "weather-thunder",
    "weather-mist"
  ];

  function setTheme(themeClass) {
    themeClasses.forEach((cls) => body.classList.remove(cls));
    body.classList.add(themeClass);
    // "прыжок" карточки при обновлении
if (weatherCard) {
  weatherCard.classList.remove("is-pop");   // сброс (чтобы анимация могла повторяться)
  void weatherCard.offsetWidth;             // маленький "трюк" для перезапуска анимации
  weatherCard.classList.add("is-pop");
}

  }

  function getThemeByWeather(main) {
    const value = main.toLowerCase();

    if (value.includes("rain") || value.includes("drizzle")) {
      return "weather-rain";
    }
    if (value.includes("snow")) {
      return "weather-snow";
    }
    if (value.includes("thunder")) {
      return "weather-thunder";
    }
    if (value.includes("cloud")) {
      return "weather-clouds";
    }
    if (
      value.includes("mist") ||
      value.includes("fog") ||
      value.includes("haze") ||
      value.includes("smoke")
    ) {
      return "weather-mist";
    }
    return "weather-clear";
  }

  function getEmojiByWeather(main) {
    const value = main.toLowerCase();

    if (value.includes("rain") || value.includes("drizzle")) return "🌧️";
    if (value.includes("snow")) return "❄️";
    if (value.includes("thunder")) return "⛈️";
    if (value.includes("cloud")) return "☁️";
    if (
      value.includes("mist") ||
      value.includes("fog") ||
      value.includes("haze") ||
      value.includes("smoke")
    )
      return "🌫️";

    return "☀️";
  }

  async function fetchWeather(city) {
    if (!city) return;

    statusLineEl.textContent = "Загружаем погоду...";
    try {
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
        city
      )}&appid=${API_KEY}&units=metric&lang=ru`;

      const response = await fetch(url);

      if (!response.ok) {
        if (response.status === 404) {
          statusLineEl.textContent = "Город не найден. Проверьте написание.";
        } else {
          statusLineEl.textContent = "Ошибка при получении погоды.";
        }
        return;
      }

      const data = await response.json();

      const cityName = `${data.name}, ${data.sys.country}`;
      const temp = Math.round(data.main.temp);
      const feelsLike = Math.round(data.main.feels_like);
      const humidity = data.main.humidity;
      const windSpeed = data.wind.speed;
      const main = data.weather[0].main;
      const description = data.weather[0].description;

      // Обновляем текст
      cityNameEl.textContent = cityName;
      weatherDescEl.textContent =
        description.charAt(0).toUpperCase() + description.slice(1);
      tempValueEl.textContent = temp.toString();
      feelsLikeEl.textContent = `${feelsLike} °C`;
      humidityEl.textContent = `${humidity} %`;
      windEl.textContent = `${windSpeed} м/с`;

      // Обновляем эмодзи
      const emoji = getEmojiByWeather(main);
      weatherEmojiEl.textContent = emoji;

      // Обновляем тему
      const themeClass = getThemeByWeather(main);
      setTheme(themeClass);

      if (themeClass === "weather-rain" || themeClass === "weather-thunder") {
        statusLineEl.textContent =
          "На улице непогода. Не забудьте взять зонт!";
      } else if (themeClass === "weather-clear") {
        statusLineEl.textContent =
          "Погода радует. Отличный день, чтобы провести время на улице!";
      } else {
        statusLineEl.textContent = "Погода обновлена.";
      }
    } catch (error) {
      console.error(error);
      statusLineEl.textContent = "Произошла ошибка соединения.";
    }
  }

  // Слушатели
  searchBtn.addEventListener("click", function () {
    const city = cityInput.value.trim();
    fetchWeather(city);
  });

  cityInput.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      const city = cityInput.value.trim();
      fetchWeather(city);
    }
  });

  quickCityButtons.forEach((btn) => {
    btn.addEventListener("click", function () {
      const city = btn.getAttribute("data-city");
      cityInput.value = city;
      fetchWeather(city);
    });
  });

  // Начальная загрузка погоды для Москвы
  fetchWeather("Москва");
});

