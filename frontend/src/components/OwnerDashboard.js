import React, { useEffect, useState, useCallback } from 'react';

export default function OwnerDashboard() {
  const [restaurant, setRestaurant] = useState(null);
  const [restaurantLocation, setRestaurantLocation] = useState('');
  const [menu, setMenu] = useState([]);
  const [newItem, setNewItem] = useState({ name: '', price: '' });
  const [editItem, setEditItem] = useState(null);
  const token = localStorage.getItem('token');

  // 👉 Fetch restaurant info
  const fetchRestaurant = useCallback(() => {
    fetch('http://localhost:3000/owner/restaurant', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        setRestaurant(data.restaurant);
        setRestaurantLocation(data.restaurant?.location || '');
      });
  }, [token]);

  // 👉 Fetch menu
  const fetchMenu = useCallback(() => {
    fetch('http://localhost:3000/owner/menu', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setMenu(data.menu || []));
  }, [token]);

  useEffect(() => {
    fetchRestaurant();
    fetchMenu();
  }, [fetchRestaurant, fetchMenu]);

  const handleRestaurantSubmit = (e) => {
    e.preventDefault();
    const method = restaurant ? 'PUT' : 'POST';

    fetch('http://localhost:3000/owner/restaurant', {
      method,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ location: restaurantLocation })
    })
      .then(res => res.json())
      .then(data => {
        console.log("🏢 Restaurant response:", data);
        fetchRestaurant();
      });
  };

  const handleAdd = (e) => {
    e.preventDefault();

    const payload = {
      name: newItem.name,
      price: parseFloat(newItem.price)
    };

    fetch('http://localhost:3000/owner/menu', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(payload)
    })
      .then(res => res.json())
      .then(data => {
        console.log("✅ Add response:", data);
        setNewItem({ name: '', price: '' });
        fetchMenu();
      })
      .catch(err => console.error("❌ Error adding item:", err));
  };

  const handleUpdate = (e) => {
    e.preventDefault();

    const payload = {
      name: editItem.name,
      price: parseFloat(editItem.price)
    };

    fetch(`http://localhost:3000/owner/menu/${editItem.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(payload)
    })
      .then(res => res.json())
      .then(data => {
        console.log("✅ Update response:", data);
        setEditItem(null);
        fetchMenu();
      })
      .catch(err => console.error("❌ Error updating item:", err));
  };

  const handleDelete = (id) => {
    if (!window.confirm("Delete this item?")) return;

    fetch(`http://localhost:3000/owner/menu/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        console.log("🗑️ Delete response:", data);
        fetchMenu();
      })
      .catch(err => console.error("❌ Error deleting item:", err));
  };

  return (
    <div>
      <h2>🍽️ Owner Dashboard</h2>

      {/* 🏢 Restaurant Info */}
      <section>
        <h3>🏢 Your Restaurant</h3>
        <form onSubmit={handleRestaurantSubmit}>
          <p><strong>Name:</strong> {restaurant ? restaurant.name : '(Will use your username)'}</p>
          <input
            placeholder="Location"
            value={restaurantLocation}
            onChange={(e) => setRestaurantLocation(e.target.value)}
            required
          />
          <button type="submit">{restaurant ? 'Update' : 'Create'} Restaurant</button>
        </form>
      </section>

      <hr />

      {/* 🍕 Menu Items */}
      <section>
        <h3>Your Menu</h3>
        <table border="1" cellPadding="8">
          <thead>
            <tr>
              <th>ID</th><th>Name</th><th>Price</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {menu.map(item => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>{item.name}</td>
                <td>${item.price}</td>
                <td>
                  <button onClick={() => setEditItem(item)}>✏️ Edit</button>
                  <button onClick={() => handleDelete(item.id)}>🗑️ Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <hr />

        {editItem ? (
          <form onSubmit={handleUpdate}>
            <h4>✏️ Edit Menu Item</h4>
            <input
              value={editItem.name}
              onChange={e => setEditItem({ ...editItem, name: e.target.value })}
              placeholder="Name"
              required
            />
            <input
              type="number"
              value={editItem.price}
              onChange={e => setEditItem({ ...editItem, price: e.target.value })}
              placeholder="Price"
              required
            />
            <button type="submit">💾 Update</button>
            <button type="button" onClick={() => setEditItem(null)}>Cancel</button>
          </form>
        ) : (
          <form onSubmit={handleAdd}>
            <h4>➕ Add New Menu Item</h4>
            <input
              value={newItem.name}
              onChange={e => setNewItem({ ...newItem, name: e.target.value })}
              placeholder="Name"
              required
            />
            <input
              type="number"
              value={newItem.price}
              onChange={e => setNewItem({ ...newItem, price: e.target.value })}
              placeholder="Price"
              required
            />
            <button type="submit">Add</button>
          </form>
        )}
      </section>
    </div>
  );
}
