import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Search from './components/Search';
import WeatherDisplay from './components/WeatherDisplay';
import Favorites from './components/Favorites';
import './App.css';

const API_KEY = '19367d1d88a155de5d38b3631143dbaf';
const API_BASE_URL = 'https://api.openweathermap.org/data/2.5';

function App() {
  const [weatherData, setWeatherData] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [units, setUnits] = useState('metric');

  useEffect(() => {
    const lastSearchedCity = localStorage.getItem('lastSearchedCity');
    if (lastSearchedCity) {
      fetchWeatherData(lastSearchedCity);
    }
    fetchFavorites();
  }, []);

  const fetchWeatherData = async (city) => {
    try {
      const currentWeatherResponse = await axios.get(
        `${API_BASE_URL}/weather?q=${city}&units=${units}&appid=${API_KEY}`
      );
      const forecastResponse = await axios.get(
        `${API_BASE_URL}/forecast?q=${city}&units=${units}&appid=${API_KEY}`
      );
      setWeatherData({
        current: currentWeatherResponse.data,
        forecast: forecastResponse.data,
      });
      localStorage.setItem('lastSearchedCity', city);
    } catch (error) {
      console.error('Error fetching weather data:', error);
      alert('Failed to fetch weather data. Please try again.');
    }
  };

  const fetchFavorites = async () => {
    try {
      const response = await axios.get('http://localhost:3001/favorites');
      setFavorites(response.data);
    } catch (error) {
      console.error('Error fetching favorites:', error);
    }
  };

  const addToFavorites = async (city) => {
    try {
      await axios.post('http://localhost:3001/favorites', { city });
      fetchFavorites();
    } catch (error) {
      console.error('Error adding to favorites:', error);
    }
  };

  const removeFromFavorites = async (id) => {
    try {
      await axios.delete(`http://localhost:3001/favorites/${id}`);
      fetchFavorites();
    } catch (error) {
      console.error('Error removing from favorites:', error);
    }
  };

  const toggleUnits = () => {
    setUnits(units === 'metric' ? 'imperial' : 'metric');
    if (weatherData) {
      fetchWeatherData(weatherData.current.name);
    }
  };

  return (
    <div className="App">
      <h1>Weather Dashboard</h1>
      <Search onSearch={fetchWeatherData} />
      <button onClick={toggleUnits}>
        Switch to {units === 'metric' ? 'Fahrenheit' : 'Celsius'}
      </button>
      {weatherData && (
        <WeatherDisplay
          weatherData={weatherData}
          units={units}
          onAddToFavorites={() => addToFavorites(weatherData.current.name)}
        />
      )}
      <Favorites
        favorites={favorites}
        onSelectFavorite={fetchWeatherData}
        onRemoveFavorite={removeFromFavorites}
      />
    </div>
  );
}

export default App;