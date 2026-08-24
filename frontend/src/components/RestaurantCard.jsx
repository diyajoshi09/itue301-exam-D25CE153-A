import React from 'react';

const RestaurantCard = ({ name, cuisine, rating, isOpen, onSelect }) => {
  return (
    <div className={`restaurant-card ${isOpen ? 'card-open' : 'card-closed'}`}>
      <div className="card-header">
        <h3 className="restaurant-name">{name}</h3>
        <span className={`status-badge ${isOpen ? 'badge-open' : 'badge-closed'}`}>
          {isOpen ? 'Open Now' : 'Closed'}
        </span>
      </div>
      <p className="restaurant-cuisine">🍽️ <strong>Cuisine:</strong> {cuisine}</p>
      <p className="restaurant-rating">⭐ <strong>Rating:</strong> {rating} / 5.0</p>
      
      {onSelect && (
        <button
          className="btn-select"
          disabled={!isOpen}
          onClick={() => onSelect(name)}
        >
          {isOpen ? 'Order From Here' : 'Currently Unavailable'}
        </button>
      )}
    </div>
  );
};

export default RestaurantCard;
