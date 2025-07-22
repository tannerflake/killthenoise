import React from 'react';
import { Link } from 'react-router-dom';

const Header: React.FC = () => {
  return (
    <header className="header">
      <div className="container">
        <div className="d-flex justify-between align-center">
          <Link to="/" className="logo">
            <h1>KillTheNoise.ai</h1>
          </Link>
          
          <nav className="nav">
            <ul className="nav-list">
              <li className="nav-item">
                <Link to="/dashboard" className="nav-link">
                  Dashboard
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/integrations" className="nav-link">
                  Integrations
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/analytics" className="nav-link">
                  Analytics
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header; 