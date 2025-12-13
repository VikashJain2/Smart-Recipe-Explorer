import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import RecipePage from './pages/RecipePage';
import WelcomeModal from './components/WelcomeModal';

function App() {
  // const [isFirstVisit, setIsFirstVisit] = useState(false);
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);

  useEffect(() => {
    // Check if it's first visit
    const hasVisited = localStorage.getItem('hasVisitedRecipeApp');
    if (!hasVisited) {
      // setIsFirstVisit(true);
      localStorage.setItem('hasVisitedRecipeApp', 'true');
      
      // Show welcome modal after 2 seconds
      setTimeout(() => {
        setShowWelcomeModal(true);
      }, 2000);
    }

  }, []);

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
            },
            success: {
              iconTheme: {
                primary: '#10B981',
                secondary: '#fff',
              },
            },
            error: {
              iconTheme: {
                primary: '#EF4444',
                secondary: '#fff',
              },
            },
          }}
        />
        
        <Navbar />
        
        <main className="pb-20">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/recipe/:id" element={<RecipePage />} />
            <Route path="/ai-suggestions" element={<HomePage showAIPanel={true} />} />
            <Route path="/add-recipe" element={<HomePage showAddModal={true} />} />
          </Routes>
        </main>
        
        {showWelcomeModal && (
          <WelcomeModal 
            isOpen={showWelcomeModal}
            onClose={() => setShowWelcomeModal(false)}
          />
        )}
        
        {/* Footer */}
        <footer className="bg-white border-t py-8 mt-12">
          <div className="container mx-auto px-4 text-center text-gray-600">
            <p className="mb-2">🍳 Smart Recipe Explorer - MERN + AI Integration</p>
            <p className="text-sm">Built with React, Node.js, Express, MongoDB & Groq AI</p>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;