import React from 'react';
import '../styles/header.css';

function Header({ title, image, pageNo }) {
    const headerStyle = {
        background: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)),url(${image})`,
        backgroundSize: "102%"
    };

    return (
        <div className="header" style={headerStyle}>
            {/* <div className="overlay"></div> */}
            <h1 className="section-title">{title}</h1>
            <h1 className="page-number">{pageNo}</h1>
        </div>
    );
}

export default Header;
