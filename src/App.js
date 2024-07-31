import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import QuotaPrint from './components/quotaPrint';
import ViewDetail from './components/viewDetail';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<QuotaPrint />} />
                <Route path="/view-detail" element={<ViewDetail />} />
            </Routes>
        </Router>
    );
}

export default App;
