import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const ModifyMember = () => {
    const { id } = useParams();
    const [formData, setFormData] = useState({
        name: '',
        email: ''
    });
    const [loading, setLoading] = useState(false);
    const [fetchLoading, setFetchLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchMember();
    }, [fetchMember]);

    const fetchMember = useCallback(async () => {
        const token = localStorage.getItem('token');

        if (!token) {
            navigate('/login');
            return;
        }

        try {
            setFetchLoading(true);

            const response = await axios.get(`${API_URL}/members/${id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.data.status === 'success') {
                const member = response.data.member;
                setFormData({
                    name: member.name || '',
                    email: member.email || ''
                });
            } else {
                setError('Membre non trouvé');
            }
        } catch (err) {
            console.error('Erreur:', err);

            if (err.response?.status === 401 || err.response?.status === 403) {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                navigate('/login');
            } else if (err.response?.status === 404) {
                setError('Membre non trouvé');
            } else {
                setError('Erreur lors du chargement du membre');
            }
        } finally {
            setFetchLoading(false);
        }
    }, [id, navigate]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.name.trim() || !formData.email.trim()) {
            setError('Tous les champs sont requis');
            return;
        }

        const token = localStorage.getItem('token');

        if (!token) {
            navigate('/login');
            return;
        }

        try {
            setLoading(true);
            setError(null);

            const response = await axios.put(`${API_URL}/members/${id}`, formData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.data.status === 'success') {
                alert('Membre modifié avec succès !');
                navigate('/members');
            } else {
                setError('Erreur lors de la modification du membre');
            }
        } catch (err) {
            console.error('Erreur:', err);

            if (err.response?.status === 401 || err.response?.status === 403) {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                navigate('/login');
            } else {
                setError(err.response?.data?.message || 'Erreur lors de la modification du membre');
            }
        } finally {
            setLoading(false);
        }
    };

    if (fetchLoading) {
        return (
            <div style={styles.center}>
                <div style={styles.spinner}></div>
                <p>Chargement du membre...</p>
            </div>
        );
    }

    if (error && !formData.name) {
        return <div style={styles.error}>{error}</div>;
    }

    return (
        <div style={styles.container}>
            <h2>✏️ Modifier un Membre</h2>

            <form onSubmit={handleSubmit} style={styles.form}>
                <div style={styles.formGroup}>
                    <label htmlFor="name" style={styles.label}>Nom :</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        style={styles.input}
                        placeholder="Entrez le nom du membre"
                        required
                    />
                </div>

                <div style={styles.formGroup}>
                    <label htmlFor="email" style={styles.label}>Email :</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        style={styles.input}
                        placeholder="Entrez l'email du membre"
                        required
                    />
                </div>

                {error && <div style={styles.error}>{error}</div>}

                <div style={styles.buttonGroup}>
                    <button
                        type="submit"
                        disabled={loading}
                        style={styles.submitButton}
                    >
                        {loading ? 'Modification en cours...' : 'Modifier le Membre'}
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
        padding: '2rem',
        maxWidth: '600px',
        margin: '0 auto'
    },
    center: {
        textAlign: 'center',
        padding: '50px',
        fontSize: '1.2rem'
    },
    spinner: {
        border: '4px solid #f3f3f3',
        borderTop: '4px solid #3498db',
        borderRadius: '50%',
        width: '40px',
        height: '40px',
        animation: 'spin 1s linear infinite',
        margin: '0 auto 20px'
    },
    error: {
        color: 'red',
        textAlign: 'center',
        padding: '50px',
        fontSize: '1.2rem'
    },
    form: {
        backgroundColor: '#f9f9f9',
        padding: '2rem',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    },
    formGroup: {
        marginBottom: '1.5rem'
    },
    label: {
        display: 'block',
        marginBottom: '0.5rem',
        fontWeight: 'bold',
        color: '#333'
    },
    input: {
        width: '100%',
        padding: '0.75rem',
        border: '1px solid #ddd',
        borderRadius: '4px',
        fontSize: '1rem',
        boxSizing: 'border-box'
    },
    buttonGroup: {
        display: 'flex',
        gap: '1rem',
        justifyContent: 'center'
    },
    submitButton: {
        backgroundColor: '#f39c12',
        color: 'white',
        border: 'none',
        padding: '0.75rem 1.5rem',
        borderRadius: '5px',
        cursor: 'pointer',
        fontSize: '1rem',
        flex: 1
    },
    cancelButton: {
        backgroundColor: '#95a5a6',
        color: 'white',
        border: 'none',
        padding: '0.75rem 1.5rem',
        borderRadius: '5px',
        cursor: 'pointer',
        fontSize: '1rem',
        flex: 1
    }
};

export default ModifyMember;