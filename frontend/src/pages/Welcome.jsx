
import React, { useState } from 'react';
import useAuthStore from '../store/authStore';
import { useNavigate } from 'react-router-dom';

const Welcome = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const login = useAuthStore((state) => state.login);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const res = await login(email, password);
            if (res?.token) {
                navigate('/pools'); // Redirige a la página principal después del login
            } else {
                setError(res?.message || 'Error al iniciar sesión. Por favor, verifica tus credenciales.');
            }
        } catch (err) {
            setError('Ocurrió un error inesperado. Inténtalo de nuevo.');
            console.error(err);
        }
    };

    return (
        <div style={{
            display: 'flex',
            height: '100vh',
            fontFamily: 'Arial, sans-serif'
        }}>
            <div style={{
                flex: 1,
                backgroundColor: '#00529B', // Un azul corporativo más sobrio
                color: 'white',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                padding: '2rem',
                textAlign: 'center'
            }}>
                <h1 style={{ fontSize: '3.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>Vortex</h1>
                <p style={{ fontSize: '1.5rem' }}>Gestión Inteligente de Piscinas</p>
            </div>
            <div style={{
                flex: 1,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: '#f0f2f5'
            }}>
                <div style={{
                    width: '100%',
                    maxWidth: '400px',
                    padding: '3rem',
                    backgroundColor: 'white',
                    borderRadius: '8px',
                    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)'
                }}>
                    <h2 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '2rem', textAlign: 'center', color: '#333' }}>Iniciar Sesión</h2>
                    <form onSubmit={handleLogin}>
                        {error && <p style={{ color: '#e53e3e', textAlign: 'center', marginBottom: '1.5rem' }}>{error}</p>}
                        <div style={{ marginBottom: '1.5rem' }}>
                            <label htmlFor="email" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: '#555' }}>Correo Electrónico</label>
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                style={{
                                    width: '100%',
                                    padding: '0.8rem 1rem',
                                    fontSize: '1rem',
                                    border: '1px solid #ccc',
                                    borderRadius: '4px',
                                    boxSizing: 'border-box'
                                }}
                                placeholder="tu@email.com"
                            />
                        </div>
                        <div style={{ marginBottom: '2rem' }}>
                            <label htmlFor="password" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: '#555' }}>Contraseña</label>
                            <input
                                type="password"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                style={{
                                    width: '100%',
                                    padding: '0.8rem 1rem',
                                    fontSize: '1rem',
                                    border: '1px solid #ccc',
                                    borderRadius: '4px',
                                    boxSizing: 'border-box'
                                }}
                                placeholder="Tu contraseña"
                            />
                        </div>
                        <button type="submit" style={{
                            width: '100%',
                            padding: '0.8rem 1rem',
                            fontSize: '1.1rem',
                            color: 'white',
                            backgroundColor: '#007BFF',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontWeight: 'bold',
                            transition: 'background-color 0.3s'
                        }} onMouseOver={(e) => e.target.style.backgroundColor = '#0056b3'} onMouseOut={(e) => e.target.style.backgroundColor = '#007BFF'}>
                            Ingresar
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Welcome;
