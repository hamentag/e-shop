// AccordionItem.jsx

import React from 'react';

export default function AccordionItem({ title, id, parentId, children, defaultOpen = false }) {
  return (
    <div className="accordion-item">
      <h2 className="accordion-header" id={`heading-${id}`}>
        <button
          className={`accordion-button ${defaultOpen ? '' : 'collapsed'}`}
          type="button"
          data-bs-toggle="collapse"
          data-bs-target={`#${id}`}
          aria-expanded={defaultOpen ? 'true' : 'false'}
          aria-controls={id}
        >
          {title}
        </button>
      </h2>
      <div
        id={id}
        className={`accordion-collapse collapse ${defaultOpen ? 'show' : ''}`}
        aria-labelledby={`heading-${id}`}
        data-bs-parent={`#${parentId}`}
      >
        <div className="accordion-body p-0">
          {children}
        </div>
      </div>
    </div>
  );
}
