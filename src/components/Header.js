import React, { useEffect, useState } from 'react';
import '../styles/header.css';

function Header({ title, image, pageNo }) {
    const [style, setStyle] = useState({});

    useEffect(() => {
        setStyle({
            background: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url(${image}) no-repeat center center / 102%`
        });
    }, [image]);

    return (
        <div className="header" style={style}>
            <h1 className="section-title">{title}</h1>
            <h1 className="page-number">{pageNo}</h1>
        </div>
    );
}

export default Header;
