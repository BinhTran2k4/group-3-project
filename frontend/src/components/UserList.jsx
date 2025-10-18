import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function UserList() {
  const [users, setUsers] = useState([]);

  const fetchUsers = async () => {
    // const res = await axios.get('http://localhost:3000/api/users');
    const res = await axios.get('http://localhost:3000/api/users');
    setUsers(res.data);
  };

  useEffect(() => { fetchUsers(); }, []);

  return (
    <div>
      <h2>Users</h2>
      <ul>
        {users.map(u => <li key={u.id}>{u.name} - {u.email}</li>)}
      </ul>
    </div>
  )
}
