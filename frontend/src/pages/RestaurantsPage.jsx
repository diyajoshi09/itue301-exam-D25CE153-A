import React, { useState, useEffect } from 'react';
import axios from 'axios';
import RestaurantCard from '../components/RestaurantCard';
import { useNavigate } from 'react-router-dom';

const defaultMockRestaurants = [
  { _id: '1', name: 'The Italian Bistro', cuisine: 'Italian & Woodfired Pizza', rating: 4.8, isOpen: true },
  { _id: '2', name: 'Spice Symphony', cuisine: 'North Indian & Mughlai', rating: 4.5, isOpen: true },
  { _id: '3', name: 'Tokyo Express', cuisine: 'Japanese Ramen & Sushi', rating: 4.6, isOpen: false },
  { _id: '4', name: 'Taco Haven', cuisine: 'Mexican Street Food', rating: 4.2, isOpen: true },
  { _id: '5', name: 'Royal Grill & Burger', cuisine: 'American Fast Food', rating: 3.9, isOpen: false }
];

const RestaurantsPage = () => {
  const [restaurants, setRestaurants] = useState(defaultMockRestaurants);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get('http://localhost:5000/api/v1/restaurants')
      .then((res) => {
        if (res.data && res.data.data && res.data.data.length > 0) {
          setRestaurants(res.data.data);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.log('Using mock restaurants fallback:', err.message);
        setLoading(false);
      });
  }, []);

  const filteredRestaurants = restaurants.filter(
    (r) =>
      r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.cuisine.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectRestaurant = (restaurantName) => {
    navigate('/order', { state: { preselectedRestaurant: restaurantName } });
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h2>Explore Restaurants</h2>
        <p>Live REST API: <code>GET /api/v1/restaurants</code></p>
      </div>

      <div className="search-bar-container">
        <input
          type="text"
          className="search-input"
          placeholder="🔍 Filter restaurants by name or cuisine..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        {searchTerm && (
          <button className="btn-clear" onClick={() => setSearchTerm('')}>
            Clear
          </button>
        )}
      </div>

      {loading && (
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading restaurants...</p>
        </div>
      )}

      {!loading && (
        <>
          <p className="results-count">
            Showing {filteredRestaurants.length} of {restaurants.length} restaurants
          </p>
          {filteredRestaurants.length === 0 ? (
            <div className="no-data">No restaurants match your search.</div>
          ) : (
            <div className="restaurants-grid">
              {filteredRestaurants.map((restaurant) => (
                <RestaurantCard
                  key={restaurant._id || restaurant.name}
                  name={restaurant.name}
                  cuisine={restaurant.cuisine}
                  rating={restaurant.rating}
                  isOpen={restaurant.isOpen}
                  onSelect={handleSelectRestaurant}
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default RestaurantsPage;
