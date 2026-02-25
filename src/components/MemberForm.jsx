import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const API_URL = 'http://localhost:5000/api';

const MemberForm = () => {
    const [formData, setFormData] = useState({
        id: '',
        name: '',
        email: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { id } = useParams();
    const isEditMode = !!id; // true si on modifie, false si on ajoute

    // Si on est en mode édition, charger les données du membre
    useEffect(() => {
        if (isEditMode) {
            fetchMember();
        }
    }, [id]);

    const fetchMember = async () => {
        const token = localStorage.getItem('token');
        
        try {
            setLoading(true);
            const response = await axios.get(`${API_URL}/members/${id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            if (response.data.status === 'success') {
                setFormData(response.data.member);
            }
        } catch (err) {
            console.error('Erreur chargement:', err);
            setError('Erreur lors du chargement du membre');
        } finally {
            setLoading(false);
        }
    };

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

        const token = localStorage.getItem('token');
        
        if (!token) {
            navigate('/login');
            return;
        }

        try {
            if (isEditMode) {
                // MODE MODIFICATION (PUT)
                await axios.put(`${API_URL}/members/${id}`, {
                    name: formData.name,
                    email: formData.email
                }, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                alert('✅ Membre modifié avec succès !');
            } else {
                // MODE AJOUT (POST)
                await axios.post(`${API_URL}/members`, {
                    id: parseInt(formData.id),
                    name: formData.name,
                    email: formData.email
                }, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                alert('✅ Membre ajouté avec succès !');
            }
            
            // Rediriger vers la liste des membres
            navigate('/members');
            
        } catch (err) {
            console.error('Erreur:', err);
            if (err.response?.status === 401 || err.response?.status === 403) {
                localStorage.removeItem('token');
                navigate('/login');
            } else {
                setError(err.response?.data?.message || 'Une erreur est survenue');
            }
        } finally {
            setLoading(false);
        }
    };

    if (loading && isEditMode) {
        return <div style={styles.center}>Chargement...</div>;
    }

    return (
        <div style={styles.container}>
            <h2 style={styles.title}>
                {isEditMode ? '✏️ Modifier le membre' : '➕ Ajouter un membre'}
            </h2>
            
            {error && <div style={styles.error}>{error}</div>}
            
            <form onSubmit={handleSubmit} style={styles.form}>
                
                {!isEditMode && (
                    <div style={styles.formGroup}>
                        <label style={styles.label}>ID :</label>
                        <input
                            type="number"
                            name="id"
                            value={formData.id}
                            onChange={handleChange}
                            required
                            style={styles.input}
                            placeholder="Entrez l'ID (ex: 4)"
                            min="1"
                        />
                        <small style={styles.hint}>L'ID doit être unique</small>
                    </div>
                )}
                
                <div style={styles.formGroup}>
                    <label style={styles.label}>Nom complet :</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        style={styles.input}
                        placeholder="Entrez le nom du membre"
                    />
                </div>
                
                <div style={styles.formGroup}>
                    <label style={styles.label}>Email :</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        style={styles.input}
                        placeholder="Entrez l'email"
                    />
                </div>
                
                <div style={styles.buttonGroup}>
                    <button 
                        type="submit" 
                        disabled={loading}
                        style={isEditMode ? styles.updateButton : styles.addButton}
                    >
                        {loading ? 'En cours...' : (isEditMode ? '✏️ Modifier' : '➕ Ajouter')}
                    </button>
                    
                    <button 
                        type="button" 
                        onClick={() => navigate('/members')}
                        style={styles.cancelButton}
                    >
                        Annuler
                    </button>
                </div>
            </form>
        </div>
    );
};

const styles = {
    container: {
        maxWidth: '500px',
        margin: '2rem auto',
        padding: '2rem',
        backgroundColor: 'white',
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
    },
    title: {
        textAlign: 'center',
        marginBottom: '2rem',
        color: '#333'
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: '1.5rem'
    },
    formGroup: {
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem'
    },
    label: {
        fontWeight: 'bold',
        color: '#555'
    },
    input: {
        padding: '12px',
        border: '1px solid #ddd',
        borderRadius: '4px',
        fontSize: '16px',
        transition: 'border-color 0.3s'
    },
    hint: {
        color: '#666',
        fontSize: '12px'
    },
    buttonGroup: {
        display: 'flex',
        gap: '1rem',
        marginTop: '1rem'
    },
    addButton: {
        flex: 1,
        padding: '12px',
        backgroundColor: '#2ecc71',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '16px',
        fontWeight: 'bold'
    },
    updateButton: {
        flex: 1,
        padding: '12px',
        backgroundColor: '#f39c12',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '16px',
        fontWeight: 'bold'
    },
    cancelButton: {
        flex: 1,
        padding: '12px',
        backgroundColor: '#95a5a6',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '16px',
        fontWeight: 'bold'
    },
    error: {
        color: 'red',
        textAlign: 'center',
        padding: '10px',
        backgroundColor: '#ffebee',
        borderRadius: '4px'
    },
    center: {
        textAlign: 'center',
        padding: '50px'
    }
};

export default MemberForm;