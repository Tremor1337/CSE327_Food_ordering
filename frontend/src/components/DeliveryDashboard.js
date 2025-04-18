import React, { useEffect, useState } from 'react';

export default function DeliveryDashboard() {
  const [orders, setOrders] = useState([]);
  const [message, setMessage] = useState('');
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user'));

  const fetchOrders = () => {
    fetch('http://localhost:3000/delivery/orders', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setOrders(data.orders || []));
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusUpdate = (orderId, newStatus, customerUsername) => {
    fetch(`http://localhost:3000/delivery/orders/${orderId}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ status: newStatus, customer: customerUsername })
    })
      .then(res => res.json())
      .then(data => {
        setMessage(data.message);
        fetchOrders();
        setTimeout(() => setMessage(''), 3000);
      });
  };

  return (
    <div>
      <h2>🚚 Delivery Dashboard</h2>

      {message && (
        <div style={{ color: 'green', marginBottom: '10px' }}>
          <strong>{message}</strong>
        </div>
      )}

      <table border="1" cellPadding="8">
        <thead>
          <tr>
            <th>Order ID</th><th>Customer</th><th>Total</th><th>Status</th><th>Created</th><th>Update</th>
          </tr>
        </thead>
        <tbody>
          {orders.map(order => (
            <tr key={order.id}>
              <td>{order.id}</td>
              <td>{order.customer}</td>
              <td>${order.total}</td>
              <td>{order.status}</td>
              <td>{new Date(order.created_at).toLocaleString()}</td>
              <td>
                <select
                  defaultValue={order.status}
                  onChange={e => handleStatusUpdate(order.id, e.target.value, order.customer)}
                >
                  <option value="confirmed">confirmed</option>
                  <option value="preparing">preparing</option>
                  <option value="out for delivery">out for delivery</option>
                  <option value="delivered">delivered</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
