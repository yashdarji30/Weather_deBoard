import React, { useState, useEffect } from "react";
import axios from "axios";
import Search from "./components/Search";
import WeatherDisplay from "./components/WeatherDisplay";
import Favorites from "./components/Favorites";
// import.meta.env.VITE_WEATHER_API_KEY
import "./App.css";



const API_KEY =import.meta.env.VITE_WEATHER_API_KEY;
const API_BASE_URL = "https://api.openweathermap.org/data/2.5";

function App() {
  const [weatherData, setWeatherData] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [units, setUnits] = useState("metric");

  useEffect(() => {
    const lastSearchedCity = localStorage.getItem("lastSearchedCity");
    if (lastSearchedCity) {
      fetchWeatherData(lastSearchedCity);
    }
    fetchFavorites();
  }, []);

  const fetchWeatherData = async city => {
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
      localStorage.setItem("lastSearchedCity", city);
    } catch (error) {
      console.error("Error fetching weather data:", error);
      alert("Failed to fetch weather data. Please try again.");
    }
  };

  const fetchFavorites = async () => {
    try {
      const response = await axios.get("http://localhost:3001/favorites");
      setFavorites(response.data);
    } catch (error) {
      console.error("Error fetching favorites:", error);
    }
  };

  // const addToFavorites = async city => {
  //   try {
  //     await axios.post("http://localhost:3001/favorites", { city });
  //     fetchFavorites();
  //   } catch (error) {
  //     console.error("Error adding to favorites:", error);
  //   }
  // };

  const onRemoveFavorite = async (id) => {
    try {
      await axios.delete(`http://localhost:3001/favorites/${id}`);
      
      // If the API call is successful, update the local state
      setFavorites(prevFavorites => prevFavorites.filter(fav => fav.id !== id));
    } catch (error) {
      console.error('Full error:', error.response);
      // If there's an error, throw it so it can be caught in the Favorites component
      throw error;
    }
  };

  // const onRemoveFavorite = (id) => {
    // setFavorites(prevFavorites => prevFavorites.filter(fav => fav.id !== id));
  // };

  const toggleUnits = () => {
    setUnits(units === "metric" ? "imperial" : "metric");
    if (weatherData) {
      fetchWeatherData(weatherData.current.name);
    }
  };


  const onAddToFavorites = async (cityName) => {
    const normalizedCityName = cityName.toLowerCase().trim();
    
    try {
      // Check if the city already exists in favorites
      const response = await axios.get('http://localhost:3001/favorites');
      const favorites = response.data;
      
      if (favorites.some(fav => fav.city.toLowerCase().trim() === normalizedCityName)) {
        // City is already in favorites, don't add it
        console.log(`${cityName} is already in favorites.`);
        return false;
      }
      
      // Add the new city to favorites
      await axios.post('http://localhost:3001/favorites', { city: cityName });
      console.log(`${cityName} added to favorites successfully.`);
      
      // Optionally, you can fetch the updated favorites list here
      await fetchFavorites();
      
      return true;
    } catch (error) {
      console.error('Error adding to favorites:', error);
      return false;
    }
  };

  return (
    <div className="App">
      {/* <h1>Weather Dashboard</h1> */}
      <Search onSearch={fetchWeatherData} />
      <button
        onClick={toggleUnits}
        className="px-4 py-2 mt-3 font-semibold text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 dark:focus:ring-blue-800 transition duration-300 ease-in-out"
      >
        Switch to {units === "metric" ? "Fahrenheit" : "Celsius"}
      </button>
      <WeatherDisplay
        weatherData={weatherData}
        units={units}
        favorites={favorites}
        onAddToFavorites={onAddToFavorites}
      />
    
      <Favorites
        favorites={favorites}
        onSelectFavorite={fetchWeatherData}
        onRemoveFavorite={onRemoveFavorite}
      />
    </div>
  );
}

export default App;
