// // SuggestedForYou.jsx

import { useMemo, useRef } from 'react';
import useCart from '../hooks/useCart';
import useProduct from '../hooks/useProduct';

import { getRandomProducts } from '../utils/getRandomProducts';
import StarRating from './StarRating';
import ProductCarousel from './ProductCarousel';
import ProductCard from './ProductCard';

export default function SuggestedForYou() {
    const { cart } = useCart();
    const { products } = useProduct();

    const scrollRef = useRef(null);

    const suggested = useMemo(() => {
        return getRandomProducts(products, 15);
    }, [products]);

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
                    <span className="visually-hidden">Loading order details...</span>
                </div>
            </div>
        );
    }

    return (
        <ProductCarousel
            title="Suggested For You"
            products={suggested}
            renderItem={(product) => (
                <div className="scroller-card-wrapper">
                    <ProductCard product={product} />
                </div>
            )}
        />
    );
}
