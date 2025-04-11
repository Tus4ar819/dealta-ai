import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../api'; // Adjust the import path as needed

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    // Validate password length
    if (password.length < 8) {
      toast.warning("Password must be at least 8 characters! ⚠️");
      return;
    }

    // Validate password match
    if (password !== confirmPassword) {
      toast.error("Passwords do not match! ❌");
      return;
    }

    try {
      // Use Axios to send a POST request to /register with required data
      const response = await api.post('/register', { username, email, password }, {
        headers: { 'Content-Type': 'application/json' }
      });

      const data = response.data;

      if (response.status === 200 && data.success) {
        toast.success(data.message || "Registration Successful! 🎉");
        setTimeout(() => navigate('/'), 2000);
      } else {
        toast.error(data.message || "Registration Failed! ❌");
      }
    } catch (error) {
      // Extract error message if present
      const errorMsg = error.response?.data?.message || "Registration Failed! ❌";
      toast.error(errorMsg);
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-4">
          <div className="card p-4">
            <h3 className="text-center">Register</h3>
            <form onSubmit={handleRegister}>
              <div className="mb-3">
                <label className="form-label">Username</label>
                <input 
                  type="text" 
                  className="form-control" 
                  value={username} 
                  onChange={(e) => setUsername(e.target.value)} 
                  required 
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Email</label>
                <input 
                  type="email" 
                  className="form-control" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  required 
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Password</label>
                <input 
                  type="password" 
                  className="form-control" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  required 
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Confirm Password</label>
                <input 
                  type="password" 
                  className="form-control" 
                  value={confirmPassword} 
                  onChange={(e) => setConfirmPassword(e.target.value)} 
                  required 
                />
              </div>
              <button type="submit" className="btn btn-primary w-100">Register</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
