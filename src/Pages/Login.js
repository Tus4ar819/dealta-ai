import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import
const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const savedUser = JSON.parse(localStorage.getItem('rememberedUser'));
        if (savedUser) {
            setUsername(savedUser.username);
            setPassword(savedUser.password);
            setRememberMe(true);
        }
    }, []);

    const handleLogin = async (e) => {
        e.preventDefault();
    
        try {
            const response = await api('http://localhost:5000/login', {
                method: 'POST',  // Use POST instead of GET
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }) // Send credentials in the body
            });
    
            const data = await response.json();
    
            if (response.ok) {
                sessionStorage.setItem('user', JSON.stringify({ username, loginTime: Date.now() }));
    
                if (rememberMe) {
                    localStorage.setItem('rememberedUser', JSON.stringify({ username, password }));
                }
    
                toast.success("Login Successful! 🎉");
                setTimeout(() => navigate('/dashboard'), 2000);
            } else {
                toast.error(data.message || "Invalid Username or Password! ❌");
            }
        } catch (error) {
            console.error("Login Error:", error);
            toast.error("Something went wrong! ❌");
        }
    };
    
    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-4">
                    <div className="card p-4">
                        <h3 className="text-center">Login</h3>
                        <form onSubmit={handleLogin}>
                            <div className="mb-3">
                                <label className="form-label">Username</label>
                                <input type="text" className="form-control" value={username} onChange={(e) => setUsername(e.target.value)} required />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Password</label>
                                <input type="password" className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} required />
                            </div>
                            <div className="form-check">
                                <input type="checkbox" className="form-check-input" checked={rememberMe} onChange={() => setRememberMe(!rememberMe)} />
                                <label className="form-check-label">Remember Me</label>
                            </div>
                            <button type="submit" className="btn btn-success w-100 mt-3">Login</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
