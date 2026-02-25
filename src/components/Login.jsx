import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API_URL = 'http://localhost:5000/api';

const Login = ({ setIsAuthenticated }) => {
    const [formData, setFormData] = useState({
        id: '',
        username: '',
        password: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            console.log('Tentative de connexion...');
            
            const response = await axios.post(`${API_URL}/login`, {
                id: parseInt(formData.id),
                username: formData.username,
                password: formData.password
            });

            console.log('Réponse:', response.data);

            // Stocker le token dans localStorage
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
            
            // Mettre à jour l'état d'authentification
            setIsAuthenticated(true);
            
            // Rediriger vers la liste des membres
            navigate('/members');
            
        } catch (err) {
            console.error('Erreur:', err);
            setError(
                err.response?.data?.message || 
                'Erreur de connexion. Vérifiez vos identifiants.'
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <h2 style={styles.title}>🔐 Connexion</h2>
                
                {error && <div style={styles.error}>{error}</div>}
                
                <form onSubmit={handleSubmit} style={styles.form}>
                    <div style={styles.formGroup}>
                        <label>ID :</label>
                        <input
                            type="number"
                            name="id"
                            value={formData.id}
                            onChange={handleChange}
                            required
                            style={styles.input}
                            placeholder="Entrez l'ID (1)"
                        />
                    </div>
                    
                    <div style={styles.formGroup}>
                        <label>Nom d'utilisateur :</label>
                        <input
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            required
                            style={styles.input}
                            placeholder="Entrez 'fullstack'"
                        />
                    </div>
                    
                    <div style={styles.formGroup}>
                        <label>Mot de passe :</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            style={styles.input}
                            placeholder="Entrez '123456'"
                        />
                    </div>
                    
                    <div style={styles.info}>
                        <p>👤 Identifiants de test :</p>
                        <p>ID: 1, Username: fullstack, Password: 123456</p>
                    </div>
                    
                    <button 
                        type="submit" 
                        disabled={loading}
                        style={styles.button}
                    >
                        {loading ? 'Connexion...' : 'Se connecter'}
                    </button>
                </form>
            </div>
        </div>
    );
};

const styles = {
    container: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '80vh',
        backgroundColor: '#f5f5f5'
    },
    card: {
        backgroundColor: 'white',
        padding: '40px',
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        width: '100%',
        maxWidth: '400px'
    },
    title: {
        textAlign: 'center',
        marginBottom: '30px',
        color: '#333'
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: '20px'
    },
    formGroup: {
        display: 'flex',
        flexDirection: 'column',
        gap: '5px'
    },
    input: {
        padding: '10px',
        border: '1px solid #ddd',
        borderRadius: '4px',
        fontSize: '16px'
    },
    button: {
        padding: '12px',
        backgroundColor: '#3498db',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        fontSize: '16px',
        cursor: 'pointer',
        marginTop: '10px'
    },
    error: {
        color: 'red',
        textAlign: 'center',
        padding: '10px',
        backgroundColor: '#ffebee',
        borderRadius: '4px'
    },
    info: {
        backgroundColor: '#e3f2fd',
        padding: '10px',
        borderRadius: '4px',
        fontSize: '14px',
        color: '#1976d2'
    }
};

export default Login;