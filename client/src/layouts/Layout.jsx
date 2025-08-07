// src/layouts/Layout.jsx
import React from 'react';
import Footer from '../components/Footer';
import SuggestedForYou from '../components/SuggestedForYou';
import ChatWidget from '../components/ChatWidget';

const Layout = ({ children }) => {
  return (
    <div className="d-flex flex-column min-vh-100">
      <main className="flex-grow-1 container-fluid pt-5 pb-3">
        {children}
      </main>
      <div className="pb-5">
         <SuggestedForYou/>
      </div>
     
      <ChatWidget />
      <Footer />
    </div>
  );
};

export default Layout;
