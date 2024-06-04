import React, { useEffect, useRef, useState } from 'react';
import Body from "./Body";
import Header from "./Header";
import Footer from "./Footer";
import axios from 'axios';
import '../styles/page.css';

function Page() {
    const componentRef = useRef();
    const [items, setItems] = useState();

    const getItems = async () => {
        const response = await axios.get("http://localhost:1818/api/items/25a2bd15-8349-46cc-a32d-e7560cdfeed4");
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

export default Page;
