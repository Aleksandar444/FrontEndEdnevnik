import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/Login.css'
const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loginError, setLoginError] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault(); // sprecavanje da se forma automatski posalje i osvezi stranicu
        setLoginError(false); // resetuje stanje greske sa prethodnog pokusaja prijavljivanja

        //validacija unosa
        if (!username || !password) {
            setLoginError(true);
            return; 
        }
        try {
            const response = await fetch('http://localhost:8080/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Basic ' + btoa(`${username}:${password}`)
                },
                
            });

            if (response.ok) {
               const data = await response.json();
               const userRole = data.role;
               redirectUser(userRole);
            } else {
                alert('Invalid username or password. Please try again.');
            }

        }catch(error){
            console.error('Error during login:', error);
           
        }    
    }
    const redirectUser = (role) => {
        switch (role) {
            case 'ADMIN':
                navigate('/admin');
                break;
            case 'NASTAVNIK':
                navigate('/nastavnik');
                break;
            case 'UCENIK':
                navigate('/ucenik');
                break;
            case 'RODITELJ':
                navigate('/roditelj');
                break;
            default:
                navigate('/');
                break;
        }
    };
    return (
        <div className="login-container">
            <form className="login-form" onSubmit={handleLogin}>
                <h1>E-dnevnik</h1>
                <h2>Login</h2>
                <input 
                    type="text" 
                    placeholder="Username" 
                    value={username} 
                    onChange={(e) => setUsername(e.target.value)} 
                    required 
                />
                <input 
                    type="password" 
                    placeholder="Password" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    required 
                />
                {loginError && <p style={{ color: 'red' }}>Both fields are required.</p>}
                <button type="submit">Login</button>
            </form>
        </div>
    );
}
export default Login;