import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import RoomDetails from './pages/RoomDetails';
import AdminDashboard from './pages/AdminDashboard';
import './style.css'; // Import your custom CSS file here

function App() {
  return (
    <Router>
      <div>
        {/* Global Navigation Header */}
        <header>
          <h1>Hotel Booking App</h1>
          <nav>
            <ul>
              <li><a href="/">Home</a></li>
              <li><a href="/admin">Admin Dashboard</a></li>
            </ul>
          </nav>
        </header>

        {/* Main Content & Routes Container */}
        <div className="container">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/room/:id" element={<RoomDetails />} />
            <Route path="/admin" element={<AdminDashboard />} />
          </Routes>
        </div>

        {/* Global Footer */}
        <footer>
          <p>&copy; 2026 Hotel Booking App. All rights reserved.</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;