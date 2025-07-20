// // src/contexts/OverlayContext

// import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
// import { Modal, Button } from 'react-bootstrap';
// import { createPortal } from 'react-dom';

// export const OverlayContext = createContext();

// export const OverlayProvider = ({ children }) => {
//   const [msg, setMsg] = useState(null);
//   const [popUpAuthn, setPopUpAuthn] = useState(null); // 'to-login', 'to-register'

//   // Modal
//   const [modalVisible, setModalVisible] = useState(false);
//   const [modalContent, setModalContent] = useState(null);
//   const [modalTitle, setModalTitle] = useState(null);
//   const [modalProps, setModalProps] = useState({});

//   const openModal = useCallback((content, options = {}) => {
//     setModalContent(content);
//     setModalTitle(options.title || null);
//     setModalProps(options.props || {});
//     setModalVisible(true);
//   }, []);
  
//   const closeModal = useCallback(() => {
//     setModalVisible(false);
//   }, []);


//   // Toast
//   const [toasts, setToasts] = useState([]);

//   const showToast = useCallback(({ title = 'Notice', message, time = 'just now', duration = 5000 }) => {
//     const id = Date.now();
//     setToasts(prev => [...prev, { id, title, message, time }]);

//     setTimeout(() => {
//       setToasts(prev => prev.filter(t => t.id !== id));
//     }, duration);
//   }, []);



//   // // Action Toast
//   // const [actionToast, setActionToast] = useState({ show: false, message: '', actionBtn: null });

//   // const actionToastRef = useRef(null);
  
//   // const showActionToast = useCallback((message, actionBtn) => {
//   //   setActionToast({ show: true, message, actionBtn });

//   //   setTimeout(() => {
//   //     setActionToast((prev) => ({ ...prev, show: false }));
//   //   }, 5000);
//   // }, []);

//   //  useEffect(() => {
//   //   if (actionToast.show && actionToastRef.current) {
//   //     const bsToast = new window.bootstrap.Toast(actionToastRef.current, {
//   //       autohide: false,
//   //     });
//   //     bsToast.show();
//   //   }
//   // }, [actionToast.show]);
  
  
//   // Action Toast
//   const [actionToast, setActionToast] = useState({
//     show: false,
//     message: '',
//     actionBtn: null,
//   });

//   const actionToastRef = useRef(null);
//   const actionToastTimerRef = useRef(null);

//   const showActionToast = useCallback((message, actionBtnFactory) => {
//     const dismiss = () => {
//       setActionToast(prev => ({ ...prev, show: false }));
//       if (actionToastTimerRef.current) {
//         clearTimeout(actionToastTimerRef.current);
//         actionToastTimerRef.current = null;
//       }
//     };

//     const actionBtn = typeof actionBtnFactory === 'function'
//       ? actionBtnFactory(dismiss)
//       : null;

//     setActionToast({ show: true, message, actionBtn });

//     // Auto dismiss after 5s unless manually dismissed
//     actionToastTimerRef.current = setTimeout(() => {
//       dismiss();
//     }, 5000);
//   }, []);

//   useEffect(() => {
//     if (actionToast.show && actionToastRef.current) {
//       const bsToast = new window.bootstrap.Toast(actionToastRef.current, {
//         autohide: false,
//       });
//       bsToast.show();
//     }
//   }, [actionToast.show]);




//   return (
//     <OverlayContext.Provider value={{ msg, setMsg, popUpAuthn, setPopUpAuthn, openModal, closeModal,showToast, showActionToast }}>
//       {children}

//       <Modal
//         show={modalVisible}
//         onHide={closeModal}
//         onExited={() => {
//           setModalContent(null);
//           setModalTitle(null);
//           setModalProps({});
//         }}
//         centered
//         // backdrop="static"
//         {...modalProps}
//       >
//         {modalTitle && (
//           <Modal.Header closeButton>
//             <Modal.Title>{modalTitle}</Modal.Title>
//           </Modal.Header>
//         )}
//         <Modal.Body>{modalContent}</Modal.Body>
//         <Modal.Footer className="justify-content-start">
//           <Button variant="secondary" onClick={closeModal}>
//             Close
//           </Button>
//         </Modal.Footer>
//       </Modal>
      

//       {/* Toast rendering */}
//       {createPortal(
//         <div className="toast-container position-fixed bottom-0 start-0 p-5" style={{ zIndex: 1055 }}>
//           {toasts.map(({ id, title, message, time }) => (
//             <div key={id} className="toast fade show" role="alert" aria-live="assertive" aria-atomic="true">
//               <div className="toast-header">
//                 {/* <svg className="bd-placeholder-img rounded me-2" width="20" height="20" xmlns="http://www.w3.org/2000/svg">
//                   <rect width="100%" height="100%" fill="#007aff" />
//                 </svg> */}
//                 <i className="bi bi-info-circle-fill me-2 text-primary"></i>
//                 <strong className="me-auto">{title}</strong>
//                 <small className="text-body-secondary">{time}</small>
//                 <button
//                   type="button"
//                   className="btn-close"
//                   aria-label="Close"
//                   onClick={() => setToasts(prev => prev.filter(t => t.id !== id))}
//                 ></button>
//               </div>
//               <div className="toast-body">{message}</div>
//             </div>
//           ))}
//         </div>,
//         document.body
//       )}

//        {/* Action Toast rendering */}
//       <div
//         className="position-fixed top-0 start-50 translate-middle-x p-3"
//         style={{ zIndex: 1055 }}
//       >
//         <div
//           ref={actionToastRef}
//           className={`toast ${actionToast.show ? 'show' : ''}`}
//           role="alert"
//           aria-live="assertive"
//           aria-atomic="true"
//         >
//           <div className="toast-header py-0">
//             {/* <img src="..." className="rounded me-2" alt="..."/> */}
//             <div className="me-auto">E-Shop</div>
//             {/* <small className="text-body-secondary">just now</small> */}
//             <button type="button" className="btn-close ms-auto" data-bs-dismiss="toast" aria-label="Close"></button>
//           </div>

//           {actionToast.message && (
//             <div className="toast-body">   {/* d-none d-md-block */}
//               {actionToast.message}
//             </div>
//           )}

//           <div className="p-1">
//             {/* <button type="button" className="btn btn-primary btn-sm">Take action</button> */}

//             {actionToast.actionBtn && (
//               <div className="toast-action-wrapper">
//                 {React.cloneElement(actionToast.actionBtn, {
//                   onClick: (e) => {
//                     // First run original onClick (if any)
//                     actionToast.actionBtn.props?.onClick?.(e);
//                     // Then hide the toast
//                     setActionToast(prev => ({ ...prev, show: false }));
//                   },
//                 })}
//               </div>
//             )}


//           </div>


//         </div>
//       </div>

//     </OverlayContext.Provider>
//   );
// };

// export default function useOverlay() {
//   const context = useContext(OverlayContext);
//   if (!context) throw new Error("useOverlay must be used within a OverlayProvider");
//   return context;
// }


// src/contexts/OverlayContext.jsx

import React, {
  createContext,
  useContext,
  useState,
  useRef,
  useCallback,
  useEffect,
} from 'react';
import { Modal, Button } from 'react-bootstrap';
import { createPortal } from 'react-dom';

export const OverlayContext = createContext();

export const OverlayProvider = ({ children }) => {
  const [msg, setMsg] = useState(null);
  const [popUpAuthn, setPopUpAuthn] = useState(null); // 'to-login', 'to-register'

  // Modal
  const [modalVisible, setModalVisible] = useState(false);
  const [modalContent, setModalContent] = useState(null);
  const [modalTitle, setModalTitle] = useState(null);
  const [modalProps, setModalProps] = useState({});

  const openModal = useCallback((content, options = {}) => {
    setModalContent(content);
    setModalTitle(options.title || null);
    setModalProps(options.props || {});
    setModalVisible(true);
  }, []);

  const closeModal = useCallback(() => {
    setModalVisible(false);
  }, []);

  // Toast
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback(
    ({ title = 'Notice', message, time = 'just now', duration = 5000 }) => {
      const id = Date.now();
      setToasts((prev) => [...prev, { id, title, message, time }]);

      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, duration);
    },
    []
  );

  // Action Toast
  const [actionToast, setActionToast] = useState({
    show: false,
    message: '',
    actionBtn: null,
  });

  const actionToastRef = useRef(null);

  const showActionToast = useCallback((message, actionBtn = null) => {
    setActionToast({ show: true, message, actionBtn });

    // Auto-dismiss after 5 seconds
    setTimeout(() => {
      setActionToast((prev) => ({ ...prev, show: false }));
    }, 5000);
  }, []);

  useEffect(() => {
    if (actionToast.show && actionToastRef.current) {
      const bsToast = new window.bootstrap.Toast(actionToastRef.current, {
        autohide: true,
        delay: 5000,
      });
      bsToast.show();
    }
  }, [actionToast.show]);

  return (
    <OverlayContext.Provider
      value={{
        msg,
        setMsg,
        popUpAuthn,
        setPopUpAuthn,
        openModal,
        closeModal,
        showToast,
        showActionToast,
      }}
    >
      {children}

      {/* Modal Rendering */}
      <Modal
        show={modalVisible}
        onHide={closeModal}
        onExited={() => {
          setModalContent(null);
          setModalTitle(null);
          setModalProps({});
        }}
        centered
        {...modalProps}
      >
        {modalTitle && (
          <Modal.Header closeButton>
            <Modal.Title>{modalTitle}</Modal.Title>
          </Modal.Header>
        )}
        <Modal.Body>{modalContent}</Modal.Body>
        <Modal.Footer className="justify-content-start">
          <Button variant="secondary" onClick={closeModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Standard Toasts */}
      {createPortal(
        <div
          className="toast-container position-fixed bottom-0 start-0 p-5"
          style={{ zIndex: 1055 }}
        >
          {toasts.map(({ id, title, message, time }) => (
            <div
              key={id}
              className="toast fade show"
              role="alert"
              aria-live="assertive"
              aria-atomic="true"
            >
              <div className="toast-header">
                <i className="bi bi-info-circle-fill me-2 text-primary"></i>
                <strong className="me-auto">{title}</strong>
                <small className="text-body-secondary">{time}</small>
                <button
                  type="button"
                  className="btn-close"
                  aria-label="Close"
                  onClick={() =>
                    setToasts((prev) => prev.filter((t) => t.id !== id))
                  }
                ></button>
              </div>
              <div className="toast-body">{message}</div>
            </div>
          ))}
        </div>,
        document.body
      )}

      {/* Action Toast */}
      <div
        className="position-fixed top-0 start-50 translate-middle-x p-3"
        style={{ zIndex: 1055 }}
      >
        <div
          ref={actionToastRef}
          className={`toast ${actionToast.show ? 'show' : ''}`}
          role="alert"
          aria-live="assertive"
          aria-atomic="true"
        >
          <div className="toast-header py-0">
            <div className="me-auto">E-Shop</div>
            <button
              type="button"
              className="btn-close ms-auto"
              data-bs-dismiss="toast"
              aria-label="Close"
            ></button>
          </div>

          {actionToast.message && (
            <div className="toast-body">{actionToast.message}</div>
          )}

          {actionToast.actionBtn && (
            <div className="p-1">{actionToast.actionBtn}</div>
          )}
        </div>
      </div>
    </OverlayContext.Provider>
  );
};

export default function useOverlay() {
  const context = useContext(OverlayContext);
  if (!context)
    throw new Error('useOverlay must be used within a OverlayProvider');
  return context;
}
