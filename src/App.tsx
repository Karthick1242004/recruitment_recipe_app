import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import RecipeBuilder from './components/RecipeBuilder';
import { RecipeProvider } from './context/RecipeContext';

function App() {
  return (
    <RecipeProvider>
      <Router>
        <div className="min-h-screen bg-gray-50 font-sans">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/create" element={<RecipeBuilder />} />
            <Route path="/edit/:recipeId" element={<RecipeBuilder />} />
          </Routes>
        </div>
      </Router>
    </RecipeProvider>
  );
}

export default App;
