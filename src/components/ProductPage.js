import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import Body from "./Body";
import Header from "./Header";
import Footer from "./Footer";
import axios from 'axios';
import '../styles/page.css';

function ProductPage() {
    const { offset1, offset2, sectionId } = useParams();
    const componentRef = useRef();
    const [items, setItems] = useState();

    const getItems = async () => {
        const response = await axios.get(`http://localhost:1818/api/items/${sectionId}/${offset1}/${offset2}`);
        setItems(response.data);
    };

    useEffect(() => {
        getItems();
    }, []);

    return (
        <div ref={componentRef} className="menu-page">
            <Header image="https://static.wixstatic.com/media/510eca_f5c9d4a061ed4a82a3ee7189b7509c42~mv2.jpg" title="Baklava" pageNo="1" />
            <Body items={items} />
            <Footer />
        </div>
    );
}

export default ProductPage;
