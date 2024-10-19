import React from 'react';

function WeatherDisplay({ weatherData, units, onAddToFavorites }) {
  const { current, forecast } = weatherData;

  const kelvinToCelsius = (kelvin) => kelvin - 273.15;
  const kelvinToFahrenheit = (kelvin) => (kelvin - 273.15) * 9/5 + 32;

  const formatTemperature = (kelvin) => {
    const temperature = units === 'metric' ? kelvinToCelsius(kelvin) : kelvinToFahrenheit(kelvin);
    return `${temperature.toFixed(1)}°${units === 'metric' ? 'C' : 'F'}`;
  };

  const getWeatherIcon = (iconCode) => `http://openweathermap.org/img/wn/${iconCode}@2x.png`;

  return (
    <div className="bg-white shadow-lg rounded-lg p-6 max-w-2xl mx-auto mt-8">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-4">{current.name}</h2>
      <div className="current-weather flex justify-center items-center space-x-4 mb-6">
        <img 
          src={getWeatherIcon(current.weather[0].icon)} 
          alt={current.weather[0].description}
          className="w-20 h-20"
        />
        <div className="text-center">
          <p className="text-5xl font-bold text-gray-700">{formatTemperature(current.main.temp)}</p>
          <p className="text-xl text-gray-600 capitalize">{current.weather[0].description}</p>
        </div>
      </div>
      <button 
        onClick={onAddToFavorites}
        className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition duration-300 mb-6"
      >
        Add to Favorites
      </button>
      <h3 className="text-2xl font-semibold text-gray-800 mb-4">5-Day Forecast</h3>
      <div className="forecast grid grid-cols-5 gap-4">
        {forecast.list.filter((item, index) => index % 8 === 0).map((item) => (
          <div key={item.dt} className="forecast-item bg-gray-100 rounded-lg p-3 text-center">
            <p className="text-sm font-medium text-gray-700 mb-2">
              {new Date(item.dt * 1000).toLocaleDateString(undefined, { weekday: 'short' })}
            </p>
            <img 
              src={getWeatherIcon(item.weather[0].icon)} 
              alt={item.weather[0].description}
              className="w-12 h-12 mx-auto mb-2"
            />
            <p className="text-lg font-semibold text-gray-800">{formatTemperature(item.main.temp)}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default WeatherDisplay;