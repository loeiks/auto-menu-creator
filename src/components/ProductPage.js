import React, { useEffect, useRef, useState } from 'react';
import { useParams, } from 'react-router-dom';
import Body from "./Body";
import Header from "./Header";
import Footer from "./Footer";
import Drinks from './Drinks';
import axios from 'axios';
import '../styles/page.css';
import { getImageBySectionId } from '../Helpers/findImageBySectionId';

function ProductPage({ drinks }) {
    const { offset1, offset2, sectionId, pageNo } = useParams();
    const componentRef = useRef();
    const [items, setItems] = useState();
    const [title, setTitle] = useState();
    const [headerImg, setHeaderImg] = useState();

    const getItems = async () => {
        const response = await axios.get(`http://localhost:1818/api/items/${sectionId}/${drinks ? 0 : offset1}/${drinks ? 0 : offset2}`);
        setItems(response.data.items);
        setTitle(response.data.sectionData.section.name);
        setHeaderImg(getImageBySectionId(sectionId));
    };

    useEffect(() => {
        getItems();
    }, []);

    const getBody = () => {
        if (drinks) {
            return <Drinks items={items} />
        } else {
            return <Body items={items} />
        }
    }

    return (
        <div ref={componentRef} className="menu-page">
            <Header image={headerImg} title={title} pageNo={pageNo} />
            {getBody()}
            <Footer />
        </div>
    );
}

export default ProductPage;
