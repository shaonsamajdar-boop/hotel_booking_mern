import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

function Home() {
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/api/rooms')
      .then(res => setRooms(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <section className="hero">
        <h2>Find Your Perfect Stay</h2>
        <p>Book luxury rooms at the best prices, guaranteed.</p>
        <a href="#rooms-section" className="btn">Explore Rooms</a>
      </section>

      {/* Available Rooms Section */}
      <div id="rooms-section">
        <h2 style={{ color: 'var(--primary-color)', marginBottom: '1rem', fontSize: '2rem' }}>Available Rooms</h2>
        
        {/* Rooms Grid using style.css classes */}
        <div className="room-grid">
          {rooms.map(room => (
            <div key={room._id} className="room-card">
              <div className="room-info">
                <h3>{room.name}</h3>
                <p>Capacity: {room.capacity} guests</p>
                <div className="price">Rs.{room.pricePerNight} / night</div>
                <Link to={`/room/${room._id}`}>
                  <button className="btn">View Details & Book</button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Home;