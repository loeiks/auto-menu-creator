// App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ProductPage from './components/ProductPage';
import Dashboard from './components/Dashboard';
import BreakfastPage from './components/BreakfastPage';
import './app.css';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/:sectionId/:offset1/:offset2/:pageNo" element={<ProductPage />} />
                <Route path="drinks/:sectionId/:pageNo" element={<ProductPage drinks={true} />} />
                <Route path="/" element={<Dashboard />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/breakfast/:breakfastNo" element={<BreakfastPage />} />
            </Routes>
        </Router>
    );
}

export default App;
