import { useState, useEffect } from 'react';
import axios from 'axios';

export default function AdminDashboard() {
  const [rooms, setRooms] = useState([]);
  const [newRoom, setNewRoom] = useState({ name: '', type: '', pricePerNight: '', capacity: '' });

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    const { data } = await axios.get('http://localhost:5000/api/rooms');
    setRooms(data);
  };

  const handleAddRoom = async (e) => {
    e.preventDefault();
    await axios.post('http://localhost:5000/api/rooms', newRoom);
    fetchRooms(); // Refresh the list
    setNewRoom({ name: '', type: '', pricePerNight: '', capacity: '' }); // Reset form
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this room?")) {
      await axios.delete(`http://localhost:5000/api/rooms/${id}`);
      fetchRooms();
    }
  };

  return (
    <div>
      <h2>Admin Dashboard</h2>
      
      <form onSubmit={handleAddRoom} style={{ display: 'flex', gap: '10px', marginBottom: '30px' }}>
        <input type="text" placeholder="Room Name" value={newRoom.name} onChange={e => setNewRoom({...newRoom, name: e.target.value})} required />
        <input type="text" placeholder="Type (e.g. Suite)" value={newRoom.type} onChange={e => setNewRoom({...newRoom, type: e.target.value})} required />
        <input type="number" placeholder="Price" value={newRoom.pricePerNight} onChange={e => setNewRoom({...newRoom, pricePerNight: e.target.value})} required />
        <input type="number" placeholder="Capacity" value={newRoom.capacity} onChange={e => setNewRoom({...newRoom, capacity: e.target.value})} required />
        <button type="submit">Add Room</button>
      </form>

      <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: '#f4f4f4' }}>
            <th>Name</th>
            <th>Type</th>
            <th>Price</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {rooms.map(room => (
            <tr key={room._id} style={{ borderBottom: '1px solid #ddd' }}>
              <td>{room.name}</td>
              <td>{room.type}</td>
              <td>Rs.{room.pricePerNight}</td>
              <td>
                <button onClick={() => handleDelete(room._id)} style={{ color: 'red' }}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}