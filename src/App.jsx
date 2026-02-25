import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './components/Login';
import Members from './components/Members';
import MemberForm from './components/MemberForm';
import PrivateRoute from './components/PrivateRoute';

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        setIsAuthenticated(!!token);
    }, []);

    return (
        <Router>
            <div className="App">
                <Navbar 
                    isAuthenticated={isAuthenticated} 
                    setIsAuthenticated={setIsAuthenticated}
                />
                
                <Routes>
                    <Route path="/" element={
                        <Navigate to={isAuthenticated ? "/members" : "/login"} />
                    } />
                    
                    <Route path="/login" element={
                        <Login setIsAuthenticated={setIsAuthenticated} />
                    } />
                    
                    <Route path="/members" element={
                        <PrivateRoute isAuthenticated={isAuthenticated}>
                            <Members />
                        </PrivateRoute>
                    } />
                    
                    <Route path="/add-member" element={
                        <PrivateRoute isAuthenticated={isAuthenticated}>
                            <MemberForm />
                        </PrivateRoute>
                    } />
                    
                    <Route path="/edit-member/:id" element={
                        <PrivateRoute isAuthenticated={isAuthenticated}>
                            <MemberForm />
                        </PrivateRoute>
                    } />
                </Routes>
            </div>
        </Router>
    );
}

export default App;