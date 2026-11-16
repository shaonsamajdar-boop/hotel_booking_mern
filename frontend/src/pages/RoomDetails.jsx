import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

// Load your publishable key outside of component render to avoid recreating the Stripe object
const stripePromise = loadStripe('pk_test_51UOwOdCt2Vi2j1CsacVrkl1uCdKyUgHYCjO1dtcnyYfgnqdpWTLXnxJ7kxPq6vUEzDOWB1gnFnQESFIGn0QHlUMt008hrCznPV');

// Component 1: The Payment Form
const CheckoutForm = ({ room, formData, setFormData }) => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();

  const handlePayment = async (e) => {
    e.preventDefault();
    
    try {
      // 1. Get client secret from backend
      const { data } = await axios.post('http://localhost:5000/api/payments/create-payment-intent', {
        price: room.pricePerNight 
      });

      // 2. Confirm card payment via Stripe Elements
      const result = await stripe.confirmCardPayment(data.clientSecret, {
        payment_method: { card: elements.getElement(CardElement) }
      });

      if (result.error) {
        alert(result.error.message);
      } else if (result.paymentIntent.status === 'succeeded') {
        // 3. If successful, save the booking to your database
        await axios.post('http://localhost:5000/api/bookings', { 
            ...formData, 
            roomId: room._id,
            totalPrice: room.pricePerNight
        });
        alert('Payment and Booking Successful!');
        navigate('/'); // Redirect to home
      }
    } catch (err) {
      console.error(err);
      if (err.response && err.response.status === 400) {
        alert(err.response.data.message); // Overlap validation message
      } else {
        alert('An error occurred during booking.');
      }
    }
  };

  return (
    <form onSubmit={handlePayment} style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '300px' }}>
      <input type="text" placeholder="Full Name" required 
        onChange={e => setFormData({...formData, customerName: e.target.value})} />
      <input type="email" placeholder="Email Address" required 
        onChange={e => setFormData({...formData, customerEmail: e.target.value})} />
      
      <label>Check-in Date</label>
      <input type="date" required onChange={e => setFormData({...formData, checkInDate: e.target.value})} />
      
      <label>Check-out Date</label>
      <input type="date" required onChange={e => setFormData({...formData, checkOutDate: e.target.value})} />

      {/* Stripe Card Input */}
      <div style={{ margin: '20px 0', padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }}>
        <CardElement /> 
      </div>
      
      <button type="submit" disabled={!stripe} style={{ padding: '10px', cursor: 'pointer' }}>
        Pay & Book
      </button>
    </form>
  );
};

// Component 2: The Main Wrapper Component
export default function RoomDetails() {
  const { id } = useParams();
  const [room, setRoom] = useState(null);
  const [formData, setFormData] = useState({
    customerName: '', customerEmail: '', checkInDate: '', checkOutDate: ''
  });

  // Fetch room data when the page loads
  useEffect(() => {
    axios.get(`http://localhost:5000/api/rooms/${id}`)
      .then(res => setRoom(res.data))
      .catch(err => console.error(err));
  }, [id]);

  if (!room) return <p>Loading room details...</p>;

  return (
    <div>
      <h2>Book: {room.name}</h2>
      <p>{room.description}</p>
      <p><strong>Rs.{room.pricePerNight} / night</strong></p>
      
      {/* Wrap the form in Stripe Elements */}
      <Elements stripe={stripePromise}>
        <CheckoutForm room={room} formData={formData} setFormData={setFormData} />
      </Elements>
    </div>
  );
}