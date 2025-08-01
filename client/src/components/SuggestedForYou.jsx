// SuggestedForYou.jsx

import useCart from '../hooks/useCart';
import useProduct from '../hooks/useProduct';

import {getRandomProductsNotInCart} from '../utils/selectRandProducts';
import StarRating from './StarRating';

export default function SuggestedForYou() {
    const { cart } = useCart()
    const { products } = useProduct()

    const suggested = getRandomProductsNotInCart(products, cart, 3)

    return (
        <div className='pb-5 my-5'>
            Tst..
            <StarRating rating={3.25} />
        </div>
    )
}