import React, { useState } from 'react';
import axios from 'axios';

function Favorites({ favorites, onSelectFavorite, onRemoveFavorite }) {
  const [error, setError] = useState(null);

  const handleRemoveFavorite = async (id) => {
    try {
      setError(null);
      await onRemoveFavorite(id);
    } catch (err) {
      console.error('Error removing favorite:', err);
      setError('Failed to remove favorite. Please try again.');
      
      if (axios.isAxiosError(err)) {
        if (err.response?.status === 404) {
          setError('The favorite city was not found. It may have already been removed.');
        } else {
          setError(`Error: ${err.message}`);
        }
      }
    }
  };

  return (
    <div className="bg-white shadow-lg rounded-lg p-6 mt-8 max-w-md mx-auto">
      <h3 className="text-2xl font-semibold text-gray-800 mb-4">Favorite Cities</h3>
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      )}
      {favorites.length === 0 ? (
        <p className="text-gray-600 italic">No favorite cities added yet.</p>
      ) : (
        <ul className="space-y-2">
          {favorites.map((favorite) => (
            <li 
              key={favorite.id} 
              className="flex items-center justify-between bg-gray-100 rounded-lg p-3 transition duration-300 hover:bg-gray-200"
            >
              <button
                onClick={() => onSelectFavorite(favorite.city)}
                className="text-blue-600 hover:text-blue-100 cursor-pointer font-medium text-left flex-grow mr-2"
              >
                {favorite.city}
              </button>
              <button
                onClick={() => handleRemoveFavorite(favorite.id)}
                className="bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-3 rounded text-sm transition duration-300"
                aria-label={`Remove ${favorite.city} from favorites`}
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Favorites;