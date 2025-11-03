import React from 'react';
import '../styles/Header.css';

interface User {
  id: string;
  displayName: string;
  email: string;
  photo: string;
  provider: string;
}

interface HeaderProps {
  user: User | null;
  onLogout: () => void;
  onLoginClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ user, onLogout, onLoginClick }) => {
  return (
    <header className="app-header">
      <div className="header-content">
        <div className="logo">
          <svg viewBox="0 0 24 24" width="32" height="32">
            <path fill="currentColor" d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
          </svg>
          <h1>Image Search</h1>
        </div>
        
        {user ? (
          <div className="user-menu">
            <div className="user-info">
              {user.photo && (
                <img 
                  src={user.photo} 
                  alt={user.displayName} 
                  className="user-avatar"
                />
              )}
              <span className="user-name">{user.displayName}</span>
            </div>
            <button onClick={onLogout} className="logout-btn">
              Logout
            </button>
          </div>
        ) : (
          <button onClick={onLoginClick} className="login-btn-header">
            Login
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;
