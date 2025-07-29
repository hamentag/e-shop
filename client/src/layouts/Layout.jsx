// src/layouts/Layout.jsx
import React from 'react';
import Footer from '../components/Footer';

const Layout = ({ children }) => {
  return (
    <div className="d-flex flex-column min-vh-100">
      <main className="flex-grow-1 container-fluid pt-5">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
