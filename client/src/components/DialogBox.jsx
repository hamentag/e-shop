
// components/DialogBox.jsx
import React, { useEffect } from 'react';

export default function DialogBox({ msg, setMsg }) {
  
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setMsg(null);
      }
    };

    // Attach event listener
    document.addEventListener('keydown', handleKeyDown);

    // Cleanup
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [setMsg]);

  return (
    <>
      <div className="dialog-box">
        <div className="dialog-box-main">
          <p>{msg.txt}</p>
          <div>{msg.more}</div>
        </div>
        <button onClick={() => setMsg(null)} style={{ fontSize: '18px' }}> &times; </button>
      </div>
      <div className="overlay" onClick={() => setMsg(null)}></div>
    </>
  );
}
