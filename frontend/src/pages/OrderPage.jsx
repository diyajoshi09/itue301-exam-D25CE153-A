import React, { useState, useContext, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const OrderPage = () => {
  const { customer, token } = useContext(AuthContext);
  const location = useLocation();

  const [restaurants, setRestaurants] = useState([]);
  const [selectedRestaurantId, setSelectedRestaurantId] = useState('');
  const [selectedRestaurantName, setSelectedRestaurantName] = useState('');
  
  const [itemName, setItemName] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [price, setPrice] = useState(150);
  const [cartItems, setCartItems] = useState([
    { name: 'Special Combo Meal', quantity: 1, price: 250 }
  ]);
  const [deliveryAddress, setDeliveryAddress] = useState(customer?.address || 'Hostel Block B, CSPIT');

  const [orderStatus, setOrderStatus] = useState({ loading: false, success: null, error: null, orderData: null });

  useEffect(() => {
    axios
      .get('http://localhost:5000/api/v1/restaurants')
      .then((res) => {
        const list = res.data.data || [];
        setRestaurants(list);
        if (list.length > 0) {
          const pre = location.state?.preselectedRestaurant;
          const matched = list.find((r) => r.name === pre) || list[0];
          setSelectedRestaurantId(matched._id);
          setSelectedRestaurantName(matched.name);
        }
      })
      .catch((err) => console.error(err));
  }, [location.state]);

  const handleRestaurantChange = (e) => {
    const rId = e.target.value;
    setSelectedRestaurantId(rId);
    const found = restaurants.find((r) => r._id === rId);
    if (found) setSelectedRestaurantName(found.name);
  };

  const handleAddItem = (e) => {
    e.preventDefault();
    if (!itemName.trim()) return;
    setCartItems([...cartItems, { name: itemName.trim(), quantity: Number(quantity), price: Number(price) }]);
    setItemName('');
    setQuantity(1);
  };

  const handleRemoveItem = (index) => {
    setCartItems(cartItems.filter((_, i) => i !== index));
  };

  const totalAmount = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const handlePlaceOrder = async () => {
    if (!selectedRestaurantId) {
      setOrderStatus({ loading: false, success: false, error: 'Please select a restaurant', orderData: null });
      return;
    }
    if (cartItems.length === 0) {
      setOrderStatus({ loading: false, success: false, error: 'Cart is empty. Add at least one item.', orderData: null });
      return;
    }

    try {
      setOrderStatus({ loading: true, success: null, error: null, orderData: null });
      const payload = {
        customerId: customer?._id,
        restaurantId: selectedRestaurantId,
        items: cartItems,
        totalAmount: totalAmount,
        status: 'pending'
      };

      const res = await axios.post('http://localhost:5000/api/v1/orders', payload, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setOrderStatus({
        loading: false,
        success: true,
        error: null,
        orderData: res.data.data
      });
    } catch (err) {
      setOrderStatus({
        loading: false,
        success: false,
        error: err.response?.data?.message || err.response?.data?.errors?.join(', ') || 'Failed to create order',
        orderData: null
      });
    }
  };

  return (
    <div className="page-container order-page">
      <h2>🛒 Place Food Order (Protected Route)</h2>
      <p className="subtext">
        Logged in: <strong>{customer?.name}</strong> ({customer?.email})
      </p>

      {orderStatus.success && (
        <div className="alert alert-success">
          <h3>✅ Order Placed Successfully (HTTP 201 Created)!</h3>
          <p><strong>Order ID:</strong> {orderStatus.orderData?._id}</p>
          <p><strong>Status:</strong> {orderStatus.orderData?.status}</p>
          <p><strong>Total Amount:</strong> ₹{orderStatus.orderData?.totalAmount}</p>
        </div>
      )}

      {orderStatus.error && (
        <div className="alert alert-error">
          <p>❌ {orderStatus.error}</p>
        </div>
      )}

      <div className="order-layout">
        <div className="order-form-container">
          <h3>Order Details</h3>

          <div className="form-group">
            <label>Select Restaurant:</label>
            <select value={selectedRestaurantId} onChange={handleRestaurantChange}>
              {restaurants.map((r) => (
                <option key={r._id} value={r._id} disabled={!r.isOpen}>
                  {r.name} ({r.cuisine}) {r.isOpen ? '— [Open]' : '— [Closed]'}
                </option>
              ))}
            </select>
          </div>

          <div className="item-input-box">
            <h4>Add Item</h4>
            <div className="item-inputs">
              <input
                type="text"
                placeholder="Item name"
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
              />
              <input
                type="number"
                min="1"
                placeholder="Qty"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                style={{ width: '70px' }}
              />
              <input
                type="number"
                min="10"
                placeholder="Price (₹)"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                style={{ width: '90px' }}
              />
              <button type="button" onClick={handleAddItem} className="btn-secondary">
                + Add
              </button>
            </div>
          </div>

          <div className="form-group">
            <label>Delivery Address:</label>
            <textarea
              rows="3"
              value={deliveryAddress}
              onChange={(e) => setDeliveryAddress(e.target.value)}
            ></textarea>
          </div>

          <button
            onClick={handlePlaceOrder}
            className="btn-primary btn-submit-order"
            disabled={orderStatus.loading || cartItems.length === 0}
          >
            {orderStatus.loading ? 'Submitting...' : `Confirm & Place Order (₹${totalAmount})`}
          </button>
        </div>

        {/* Live State Preview */}
        <div className="live-preview-container">
          <h3>📋 Live Summary</h3>
          <div className="summary-card">
            <p><strong>Restaurant:</strong> <span className="highlight-text">{selectedRestaurantName || 'None'}</span></p>
            <p><strong>Address:</strong> {deliveryAddress}</p>
            <hr />
            <h4>Cart Items ({cartItems.length}):</h4>
            {cartItems.length === 0 ? (
              <p className="no-items">Cart is empty.</p>
            ) : (
              <ul className="cart-list">
                {cartItems.map((item, index) => (
                  <li key={index} className="cart-item">
                    <span>{item.name} × {item.quantity}</span>
                    <span>
                      ₹{item.price * item.quantity}{' '}
                      <button onClick={() => handleRemoveItem(index)} className="btn-del">✕</button>
                    </span>
                  </li>
                ))}
              </ul>
            )}
            <hr />
            <div className="total-row">
              <strong>Grand Total:</strong>
              <strong className="total-price">₹{totalAmount}</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderPage;
