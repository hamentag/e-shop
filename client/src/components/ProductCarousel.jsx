//  ProductCarousel.jsx

import { useRef } from 'react';
import useCart from '../hooks/useCart';
// import useProduct from '../hooks/useProduct';


export default function ProductCarousel({ title, products, renderItem }) {
    const { cart } = useCart();
    // const { products } = useProduct();

    const scrollRef = useRef(null);

    const scroll = (direction) => {
        const container = scrollRef.current;
        const scrollAmount = container.offsetWidth / 1.5;
        container.scrollBy({
            left: direction === 'left' ? -scrollAmount : scrollAmount,
            behavior: 'smooth',
        });
    };

    if (!cart || !products) {
        return (
            <div className="d-flex justify-content-center my-5">
                <div className="spinner-grow" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        )
    }


    return (
        <div className="position-relative mb-4 mx-0 mx-md-2">
            {title && <h5 className="mb-1 ps-2">{title}</h5>}

            {/* Left Arrow */}
            <button
                className="scroll-btn scroll-left btn btn-light shadow carousel-control-prev-icon"
                onClick={() => scroll('left')}
                aria-label="Scroll left"
            >
                
            </button>

            {/* Scrollable Product Row */}
            <div
                ref={scrollRef}
                className="d-flex overflow-auto flex-nowrap px-2 gap-2 gap-sm-3 scroll-container"
                style={{ scrollBehavior: 'smooth', maxHeight: '360px' }}
            >
                {products.map((item, index) => (
                    <div key={item.id || index} className="flex-shrink-0">
                        {renderItem(item)}
                    </div>
                ))}
            </div>

            {/* Right Arrow */}
            <button
                className="scroll-btn scroll-right btn btn-light shadow carousel-control-next-icon"
                onClick={() => scroll('right')}
                aria-label="Scroll right"
            >
                
            </button>
        </div>
    );
}
