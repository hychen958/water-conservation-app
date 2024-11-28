import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerUser } from './api';

const Register = () => {
  const [formData, setFormData] = useState({ email: '', password: '', forgot password? "});
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await registerUser(formData);
    if (result.message) {
      alert(result.message);
      navigate('/login');
    } else {
      alert('Error registering user');
    }
  };

  return (
    <div>
      <h1>Register</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="email"
          placeholder="email"
          value={formData.email}
          onChange={handleChange}
        />
        <input
          type="password"
          name="password"
          placeholder="password"
          value={formData.password}
          onChange={handleChange}
        />
        <input
          type="forgot password"
          name="forgot password"
          placeholder="Forgot Password"
          value={formData.password}
          onChange={handleChange}
        />
        <button type="submit">Register</button>
      </form>
      <p>
        Already have an account?{' '}
        <button onClick={() => navigate('/login')}>
          Login here
        </button>
      </p>
    </div>
  );
};

export default Register;