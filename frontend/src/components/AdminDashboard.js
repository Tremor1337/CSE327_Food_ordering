import React, { useEffect, useState } from 'react';

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [logText, setLogText] = useState('');
  const currentUser = JSON.parse(localStorage.getItem('user'));

  const fetchUsers = () => {
    const token = localStorage.getItem('token');

    fetch('http://localhost:3000/admin/users', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        if (data.users) setUsers(data.users);
      });
  };

  const fetchLogs = () => {
    const token = localStorage.getItem('token');
  
    fetch('http://localhost:3000/admin/logs', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.text()) // ✅ parse as plain text now
      .then(logString => {
        console.log("📥 Fetched log content:", logString);
        setLogText(logString || '⚠️ Log file is empty.');
      })
      .catch(err => {
        console.error("❌ Error fetching logs:", err);
        setLogText('❌ Error fetching logs.');
      });
  };
  

  useEffect(() => {
    fetchUsers();
  }, []);

  const deleteUser = (id) => {
    const token = localStorage.getItem('token');

    fetch(`http://localhost:3000/admin/users/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        alert(data.message);
        fetchUsers();
      });
  };

  const updateUserRole = (id, role) => {
    const token = localStorage.getItem('token');

    fetch(`http://localhost:3000/admin/users/${id}/role`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ role })
    })
      .then(res => res.json())
      .then(data => {
        alert(data.message);
        fetchUsers();
      });
  };

  return (
    <div>
      <h2>🛡️ Admin Dashboard</h2>

      <h3>All Registered Users:</h3>
      <table border="1" cellPadding="8">
        <thead>
          <tr>
            <th>ID</th><th>Username</th><th>Role</th><th>Action</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => {
            const isCurrent = user.username === currentUser.username;

            return (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>
                  {user.username}
                  {isCurrent && <strong> (You)</strong>}
                </td>
                <td>
                  {isCurrent ? (
                    user.role
                  ) : (
                    <select
                      value={user.role}
                      onChange={(e) => {
                        const newRole = e.target.value;
                        if (newRole !== user.role) {
                          updateUserRole(user.id, newRole);
                        }
                      }}
                    >
                      <option value="customer">customer</option>
                      <option value="owner">owner</option>
                      <option value="delivery">delivery</option>
                      <option value="admin">admin</option>
                    </select>
                  )}
                </td>
                <td>
                  {isCurrent ? (
                    '❌'
                  ) : (
                    <button onClick={() => deleteUser(user.id)}>🗑️ Delete</button>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <h3 style={{ marginTop: '30px' }}>📝 System Logs:</h3>
      <button onClick={() => {
        console.log("🔁 Refresh Logs button clicked");
        fetchLogs();
      }} style={{
        marginBottom: '10px',
        padding: '6px 12px',
        backgroundColor: '#007bff',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer'
      }}>
        🔁 Refresh Logs
      </button>

      <pre style={{
        background: '#f4f4f4',
        padding: '10px',
        maxHeight: '300px',
        overflowY: 'auto',
        border: '1px solid #ccc',
        fontSize: '14px',
        whiteSpace: 'pre-wrap',
        lineHeight: '1.5',
        color: '#222'
      }}>
        {logText || 'No logs yet.'}
      </pre>
    </div>
  );
}
