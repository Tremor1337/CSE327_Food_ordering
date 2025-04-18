import React, { useEffect, useState } from 'react';
import './CustomerDashboard.css';

export default function CustomerDashboard() {
  const [menu, setMenu] = useState([]);
  const [cart, setCart] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [message, setMessage] = useState('');
  const [orders, setOrders] = useState([]);
  const [eta, setEta] = useState('');
  const [address, setAddress] = useState('');
  const [liveStatuses, setLiveStatuses] = useState([]);
  const [autoTrack, setAutoTrack] = useState(false);

  const user = JSON.parse(localStorage.getItem('user'));
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetch('http://localhost:3000/customer/menu')
      .then(res => res.json())
      .then(data => setMenu(data.menu || []));
    fetchOrders();
  }, []);

  useEffect(() => {
    let interval;
    if (autoTrack) {
      interval = setInterval(handleLiveStatusFetch, 5000);
    }
    return () => clearInterval(interval);
  }, [autoTrack]);

  const fetchOrders = () => {
    fetch(`http://localhost:3000/customer/orders/${user.username}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setOrders(data.orders || []));
  };

  const addToCart = (item) => {
    setCart(prev => [...prev, item]);
  };

  const getTotal = () => {
    return cart.reduce((sum, item) => sum + parseFloat(item.price), 0).toFixed(2);
  };

  const handlePlaceOrder = async () => {
    const amount = getTotal();
    const payRes = await fetch(`http://localhost:3000/pay/${paymentMethod}/${amount}`);
    const payData = await payRes.json();
    const orderRes = await fetch(`http://localhost:3000/order/place/${user.username}/${amount}/${paymentMethod}`);
    const orderData = await orderRes.json();

    setMessage(`${payData.message} | ${orderData.message || 'Order placed successfully.'}`);
    setCart([]);
    fetchOrders();
  };

  const handleLiveStatusFetch = async () => {
    const res = await fetch(`http://localhost:3000/customer/status/${user.username}`);
    const data = await res.json();
    if (Array.isArray(data.statuses)) {
      setLiveStatuses(data.statuses);
    } else {
      setLiveStatuses([]);
    }
  };

  const handleGetETA = async () => {
    const res = await fetch(`http://localhost:3000/delivery/eta/${address}`);
    const data = await res.json();
    setEta(data.message || 'Could not fetch ETA');
  };

  return (
    <div className="dashboard-container">
      <h2>🛒 Customer Dashboard</h2>

      <section className="section">
        <h3>Menu Items</h3>
        <table>
          <thead>
            <tr>
              <th>Name</th><th>Price</th><th>Restaurant</th><th>Location</th><th>Action</th>
            </tr>
          </thead>
          <tbody>
            {menu.map(item => (
              <tr key={item.id}>
                <td>{item.name}</td>
                <td>${item.price}</td>
                <td>{item.restaurant_name}</td>
                <td>{item.location}</td>
                <td><button onClick={() => addToCart(item)}>➕ Add</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="section">
        <h3>🧺 Cart</h3>
        <ul>
          {cart.map((item, idx) => (
            <li key={idx}>{item.name} - ${item.price}</li>
          ))}
        </ul>
        <h4>Total: ${getTotal()}</h4>
        <label>💳 Select Payment Method:</label>
        <select value={paymentMethod} onChange={e => setPaymentMethod(e.target.value)}>
          <option value="credit">Credit Card</option>
          <option value="paypal">PayPal</option>
          <option value="cash">Cash</option>
        </select>
        <div className="button-group">
          <button onClick={handlePlaceOrder} disabled={cart.length === 0}>✅ Place Order</button>
          <button onClick={() => setCart([])} disabled={cart.length === 0}>🧹 Clear Cart</button>
        </div>
        {message && <div className="success-msg">{message}</div>}
      </section>

      <section className="section">
        <h3>📜 Past Orders</h3>
        <button onClick={fetchOrders}>🔁 Refresh Orders</button>
        <table>
          <thead>
            <tr><th>ID</th><th>Status</th><th>Total</th><th>Created</th></tr>
          </thead>
          <tbody>
            {orders.length > 0 ? (
              orders.map(order => (
                <tr key={order.id}>
                  <td>{order.id}</td>
                  <td>{order.status}</td>
                  <td>${order.total}</td>
                  <td>{new Date(order.created_at).toLocaleString()}</td>
                </tr>
              ))
            ) : (
              <tr><td colSpan="4">No orders found.</td></tr>
            )}
          </tbody>
        </table>
      </section>

      <section className="section">
        <h3>🛰️ Live Order Status</h3>
        <button onClick={handleLiveStatusFetch}>📦 Refresh Status</button>
        <label className="autotrack-toggle">
          <input type="checkbox" checked={autoTrack} onChange={() => setAutoTrack(!autoTrack)} />
          Auto-track
        </label>
        {liveStatuses.length > 0 ? (
          <ul>
            {liveStatuses.map((status, idx) => (
              <li key={idx}>📦 Order #{status.id} → <strong>{status.status}</strong></li>
            ))}
          </ul>
        ) : (
          <p><strong>📍 Status: No active orders</strong></p>
        )}
      </section>

      <section className="section">
        <h3>⏱️ Delivery ETA</h3>
        <input placeholder="Enter address" value={address} onChange={(e) => setAddress(e.target.value)} />
        <button onClick={handleGetETA}>📍 Get ETA</button>
        {eta && <p>{eta}</p>}
      </section>
    </div>
  );
}
