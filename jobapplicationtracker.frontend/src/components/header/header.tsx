import React from 'react';
import './header.css'

interface HeaderProps {
  title?: string;
}

const Header: React.FC<HeaderProps> = ({ title = "Job Application Tracker" }) => {
  return (
    <header className="header">
      <h1>{title}</h1>
    </header>
  );
};

export default Header;