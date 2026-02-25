import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = ({ isAuthenticated, setIsAuthenticated }) => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setIsAuthenticated(false);
        navigate('/login');
    };

    return (
        <nav style={styles.navbar}>
            <div style={styles.logo}>
                <Link to="/" style={styles.logoLink}>
                    🔐 JWT Members
                </Link>
            </div>
            
            <div style={styles.links}>
                {isAuthenticated ? (
                    <>
                        <Link to="/members" style={styles.link}>
                            Membres
                        </Link>
                        <button onClick={handleLogout} style={styles.logoutButton}>
                            Déconnexion
                        </button>
                    </>
                ) : (
                    <Link to="/login" style={styles.link}>
                        Connexion
                    </Link>
                )}
            </div>
        </nav>
    );
};

const styles = {
    navbar: {
        backgroundColor: '#2c3e50',
        padding: '1rem 2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        color: 'white'
    },
    logo: {
        fontSize: '1.3rem',
        fontWeight: 'bold'
    },
    logoLink: {
        color: 'white',
        textDecoration: 'none'
    },
    links: {
        display: 'flex',
        gap: '20px',
        alignItems: 'center'
    },
    link: {
        color: 'white',
        textDecoration: 'none',
        fontSize: '1.1rem'
    },
    logoutButton: {
        backgroundColor: 'transparent',
        color: 'white',
        border: '1px solid white',
        padding: '5px 15px',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '1rem'
    }
};

export default Navbar;