

import React from 'react';

function Favorites({ favorites, onSelectFavorite, onRemoveFavorite }) {
  return (
    <div className="favorites">
      <h3>Favorite Cities</h3>
      <ul>
        {favorites.map((favorite) => (
          <li key={favorite.id}>
            <span onClick={() => onSelectFavorite(favorite.city)}>{favorite.city}</span>
            <button onClick={() => onRemoveFavorite(favorite.id)}>Remove</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Favorites;