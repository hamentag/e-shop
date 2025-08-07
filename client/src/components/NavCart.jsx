// src/components/NavCart.jsx



import CartOverview from './CartOverview';

import useOverlay from '../hooks/useOverlay';
import useCart from '../hooks/useCart';
import NavAccount from './NavAccount';
import MenuButton from './MenuButton';


export default function () {
    const { cart } = useCart()
    const { showOffcanvas, hideOffcanvas } = useOverlay();
    

    return (
        < button className="btn flex-shrink-1 d-flex align-items-center justify-content-center position-relative p-0 nav-btn nav-cart" style={{ minHeight: '40px'}}
  
            onClick={() => {
                showOffcanvas({
                    title: 'Your Cart',
                    content: <CartOverview />,
                    headerButtons: [
                        <NavAccount />,
                        <MenuButton />
                    ]
                })
            }}
        >
            {/* cart */}
            <i className="bi bi-cart3 fs-3"></i>
  
           <span className="position-absolute start-75 badge rounded-pill bg-danger"
                style={{ top: '15%', transform: 'translate(-50%, -50%)' }}
            >
            {cart?.cart_count ?? 0}
            <span className="visually-hidden">items in cart</span>
            </span>

        </button>
    )
}

