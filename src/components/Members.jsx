import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API_URL = 'http://localhost:5000/api';

const Members = () => {
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const userStr = localStorage.getItem('user');
        if (userStr) {
            setUser(JSON.parse(userStr));
        }
        fetchMembers();
    }, []);

    const fetchMembers = async () => {
        const token = localStorage.getItem('token');
        
        if (!token) {
            navigate('/login');
            return;
        }

        try {
            setLoading(true);
            const response = await axios.get(`${API_URL}/members`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            if (response.data.status === 'success') {
                setMembers(response.data.members);
            }
            setError(null);
        } catch (err) {
            console.error('Erreur:', err);
            if (err.response?.status === 401 || err.response?.status === 403) {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                navigate('/login');
            } else {
                setError('Erreur lors du chargement des membres');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce membre ?')) {
            return;
        }

        const token = localStorage.getItem('token');
        
        try {
            await axios.delete(`${API_URL}/members/${id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            // Recharger la liste après suppression
            fetchMembers();
            alert('✅ Membre supprimé avec succès !');
        } catch (err) {
            console.error('Erreur suppression:', err);
            alert('Erreur lors de la suppression');
        }
    };

    const handleEdit = (id) => {
        navigate(`/edit-member/${id}`);
    };

    const handleAdd = () => {
        navigate('/add-member');
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    if (loading) {
        return (
            <div style={styles.center}>
                <div style={styles.spinner}></div>
                <p>Chargement des membres...</p>
            </div>
        );
    }

    if (error) {
        return <div style={styles.error}>{error}</div>;
    }

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <div>
                    <h2>📋 Gestion des Membres</h2>
                    {user && (
                        <p style={styles.userInfo}>
                            Connecté en tant que: <strong>{user.username}</strong>
                        </p>
                    )}
                </div>
                <div style={styles.headerButtons}>
                    <button onClick={handleAdd} style={styles.addButton}>
                        ➕ Ajouter un membre
                    </button>
                    <button onClick={handleLogout} style={styles.logoutButton}>
                        Déconnexion
                    </button>
                </div>
            </div>
            
            <div style={styles.stats}>
                <p>📊 Total: <strong>{members.length}</strong> membre(s)</p>
            </div>
            
            {members.length === 0 ? (
                <div style={styles.empty}>
                    <p>Aucun membre à afficher</p>
                    <button onClick={handleAdd} style={styles.emptyAddButton}>
                        ➕ Ajouter votre premier membre
                    </button>
                </div>
            ) : (
                <div style={styles.grid}>
                    {members.map(member => (
                        <div key={member.id} style={styles.card}>
                            <div style={styles.cardHeader}>
                                <h3>{member.name}</h3>
                                <span style={styles.badge}>ID: {member.id}</span>
                            </div>
                            <p style={styles.email}>📧 {member.email}</p>
                            <div style={styles.cardActions}>
                                <button 
                                    onClick={() => handleEdit(member.id)}
                                    style={styles.editButton}
                                >
                                    ✏️ Modifier
                                </button>
                                <button 
                                    onClick={() => handleDelete(member.id)}
                                    style={styles.deleteButton}
                                >
                                    🗑️ Supprimer
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

const styles = {
    container: {
        padding: '2rem',
        maxWidth: '1200px',
        margin: '0 auto'
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px',
        paddingBottom: '10px',
        borderBottom: '2px solid #3498db'
    },
    headerButtons: {
        display: 'flex',
        gap: '10px'
    },
    userInfo: {
        color: '#666',
        marginTop: '5px'
    },
    stats: {
        marginBottom: '20px',
        padding: '15px',
        backgroundColor: '#e8f5e8',
        borderRadius: '8px',
        fontSize: '16px'
    },
    addButton: {
        backgroundColor: '#2ecc71',
        color: 'white',
        border: 'none',
        padding: '10px 20px',
        borderRadius: '5px',
        cursor: 'pointer',
        fontSize: '14px',
        fontWeight: 'bold'
    },
    logoutButton: {
        backgroundColor: '#e74c3c',
        color: 'white',
        border: 'none',
        padding: '10px 20px',
        borderRadius: '5px',
        cursor: 'pointer',
        fontSize: '14px',
        fontWeight: 'bold'
    },
    center: {
        textAlign: 'center',
        padding: '50px',
        fontSize: '1.2rem'
    },
    error: {
        color: 'red',
        textAlign: 'center',
        padding: '50px',
        fontSize: '1.2rem'
    },
    empty: {
        textAlign: 'center',
        padding: '50px',
        color: '#666',
        backgroundColor: '#f9f9f9',
        borderRadius: '8px'
    },
    emptyAddButton: {
        backgroundColor: '#3498db',
        color: 'white',
        border: 'none',
        padding: '10px 20px',
        borderRadius: '5px',
        cursor: 'pointer',
        marginTop: '15px',
        fontSize: '16px'
    },
    grid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: '20px'
    },
    card: {
        border: '1px solid #ddd',
        borderRadius: '8px',
        padding: '20px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        backgroundColor: 'white',
        transition: 'transform 0.2s, box-shadow 0.2s',
        ':hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 4px 8px rgba(0,0,0,0.15)'
        }
    },
    cardHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '10px'
    },
    badge: {
        backgroundColor: '#3498db',
        color: 'white',
        padding: '3px 8px',
        borderRadius: '12px',
        fontSize: '12px'
    },
    email: {
        color: '#666',
        marginBottom: '15px',
        padding: '5px 0'
    },
    cardActions: {
        display: 'flex',
        gap: '10px',
        marginTop: '15px'
    },
    editButton: {
        flex: 1,
        backgroundColor: '#f39c12',
        color: 'white',
        border: 'none',
        padding: '8px',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '14px'
    },
    deleteButton: {
        flex: 1,
        backgroundColor: '#e74c3c',
        color: 'white',
        border: 'none',
        padding: '8px',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '14px'
    },
    spinner: {
        border: '4px solid #f3f3f3',
        borderTop: '4px solid #3498db',
        borderRadius: '50%',
        width: '40px',
        height: '40px',
        animation: 'spin 1s linear infinite',
        margin: '0 auto 20px'
    }
};

export default Members;