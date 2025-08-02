// MenuButton

import NavbarMenu from './NavbarMenu';
import NavAccount from './NavAccount';

import useOverlay from '../hooks/useOverlay';
import NavCart from './NavCart';

export default function MenuButton() {
    const { showOffcanvas } = useOverlay();

    return (
        <button
            className="navbar-toggler flex-shrink-1 p-0"
            type="button"
            onClick={() => {
                showOffcanvas({
                    title: 'Menu',
                    content: <NavbarMenu />,
                    headerButtons: [
                        <NavAccount />,
                        <NavCart />
                    ]
                })
            }}
        >
            <span><i className="bi bi-list fs-4"></i></span>
        </button>
    )
}



