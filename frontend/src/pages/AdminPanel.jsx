import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const AdminPanel = () => {
  const { token } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusUpdateMsg, setStatusUpdateMsg] = useState('');

  const fetchOrders = () => {
    if (!token) {
      setLoading(false);
      return;
    }
    setLoading(true);
    axios
      .get('http://localhost:5000/api/v1/orders', {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then((res) => {
        setOrders(res.data.data || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchOrders();
  }, [token]);

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      await axios.patch(
        `http://localhost:5000/api/v1/orders/${orderId}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setStatusUpdateMsg(`Status updated to "${newStatus}" for order #${orderId}`);
      fetchOrders();
      setTimeout(() => setStatusUpdateMsg(''), 4000);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update status');
    }
  };

  return (
    <div className="page-container admin-page">
      <h2>🛡️ Admin Oversight Panel</h2>
      <p className="badge-lazy">⚡ Lazy Loaded with React.lazy() + Suspense</p>

      {statusUpdateMsg && <div className="alert alert-success">{statusUpdateMsg}</div>}

      {!token ? (
        <div className="alert alert-warning">
          Please log in on the Home page first to view orders.
        </div>
      ) : loading ? (
        <p>Loading orders...</p>
      ) : orders.length === 0 ? (
        <div className="no-data">No orders found.</div>
      ) : (
        <div className="orders-table-wrapper">
          <table className="orders-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Restaurant</th>
                <th>Items</th>
                <th>Total</th>
                <th>Current Status</th>
                <th>Update (PATCH)</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((ord) => (
                <tr key={ord._id}>
                  <td><code>{ord._id.slice(-6)}</code></td>
                  <td>{ord.customerId?.name || 'Customer'}</td>
                  <td>{ord.restaurantId?.name || 'Restaurant'}</td>
                  <td>
                    {ord.items?.map((it, idx) => (
                      <div key={idx}>{it.name} (×{it.quantity})</div>
                    ))}
                  </td>
                  <td><strong>₹{ord.totalAmount}</strong></td>
                  <td><span className={`status-pill pill-${ord.status}`}>{ord.status}</span></td>
                  <td>
                    <select
                      value={ord.status}
                      onChange={(e) => handleUpdateStatus(ord._id, e.target.value)}
                    >
                      <option value="pending">pending</option>
                      <option value="preparing">preparing</option>
                      <option value="out-for-delivery">out-for-delivery</option>
                      <option value="delivered">delivered</option>
                      <option value="cancelled">cancelled</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
