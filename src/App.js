// App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ProductPage from './components/ProductPage'

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<ProductPage />} />
                <Route path="/:sectionId/:offset1/:offset2" element={<ProductPage />} />
            </Routes>
        </Router>
    );
}

export default App;
