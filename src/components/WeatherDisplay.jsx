import React, { useState, useEffect } from "react";

function WeatherDisplay({
  weatherData,
  units,
  favorites = [],
  onAddToFavorites,
}) {
  const [isFavorite, setIsFavorite] = useState(false);

  const { current, forecast } = weatherData ?? {
    current: {},
    forecast: { list: [] },
  };

  useEffect(() => {
    if (current && current.name) {
      setIsFavorite(
        favorites.some(
          favorite => favorite.city.toLowerCase() === current.name.toLowerCase()
        )
      );
    }
  }, [current, favorites]);

  const kelvinToCelsius = kelvin => kelvin;
  const kelvinToFahrenheit = kelvin => (kelvin) * 9 / 5 + 32;

  const formatTemperature = kelvin => {
    if (kelvin == null) return "N/A";
    const temperature =
      units === "metric" ? kelvinToCelsius(kelvin) : kelvinToFahrenheit(kelvin);
    return `${temperature.toFixed(1)}°${units === "metric" ? "C" : "F"}`;
  };

  const getWeatherIcon = iconCode =>
    `http://openweathermap.org/img/wn/${iconCode}@2x.png`;

  const handleAddToFavorites = () => {
    if (!current.name) return;

    if (isFavorite) {
      alert(`${current.name} is already in your favorites list.`);
    } else {
      const added = onAddToFavorites(current.name);
      if (added) {
        setIsFavorite(true);
      } else {
        alert(`${current.name} could not be added to favorites. It may already exist in the list.`);
      }
    }
  };

  return (
    <div className="bg-blue-200 shadow-lg rounded-lg p-6 max-w-2xl mx-auto mt-8">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-4">
        {current.name || "N/A"}
      </h2>
      <div className="current-weather flex justify-center items-center space-x-4 mb-6">
        <img
          src={getWeatherIcon(current.weather?.[0]?.icon)}
          alt={current.weather?.[0]?.description || "Weather icon"}
          className="w-20 h-20"
        />
        <div className="text-center">
          <p className="text-5xl font-bold text-gray-700">
            {formatTemperature(current.main?.temp)}
          </p>
          <p className="text-xl text-gray-600 capitalize">
            {current.weather?.[0]?.description || "N/A"}
          </p>
        </div>
      </div>

      <button
        onClick={handleAddToFavorites}
        className={`w-full ${
          isFavorite ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"
        } text-white font-bold py-2 px-4 rounded transition duration-300 mb-6`}
        disabled={isFavorite}
      >
        {isFavorite ? "Already in Favorites" : "Add to Favorites"}
      </button>

      <h3 className="text-2xl font-semibold text-gray-800 mb-4">
        5-Day Forecast
      </h3>
      <div className="forecast grid grid-cols-5 gap-4">
        {forecast.list
          .filter((item, index) => index % 8 === 0)
          .map(item => (
            <div
              key={item.dt}
              className="forecast-item bg-gray-100 rounded-lg p-3 text-center"
            >
              <p className="text-sm font-medium text-gray-700 mb-2">
                {new Date(item.dt * 1000).toLocaleDateString(undefined, {
                  weekday: "short",
                })}
              </p>
              <img
                src={getWeatherIcon(item.weather?.[0]?.icon)}
                alt={item.weather?.[0]?.description || "Weather icon"}
                className="w-12 h-12 mx-auto mb-2"
              />
              <p className="text-lg font-semibold text-gray-800">
                {formatTemperature(item.main?.temp)}
              </p>
            </div>
          ))}
      </div>
    </div>
  );
}

export default WeatherDisplay;