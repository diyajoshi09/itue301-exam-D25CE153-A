import React, { useState, useEffect } from 'react';
import axios from 'axios';
import RestaurantCard from '../components/RestaurantCard';
import { useNavigate } from 'react-router-dom';

const RestaurantsPage = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    axios
      .get('http://localhost:5000/api/v1/restaurants')
      .then((res) => {
        setRestaurants(res.data.data || []);
        setError(null);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError('Failed to fetch restaurants from backend API.');
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

      {error && !loading && (
        <div className="alert alert-error">
          <p>⚠️ {error}</p>
        </div>
      )}

      {!loading && !error && (
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
