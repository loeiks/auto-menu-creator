// App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ProductPage from './components/ProductPage';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/:sectionId/:offset1/:offset2/:pageNo" element={<ProductPage />} />
                <Route path="drinks/:sectionId/:pageNo" element={<ProductPage drinks={true} />} />
            </Routes>
        </Router>
    );
}

export default App;
