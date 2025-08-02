// src/components/Products.jsx

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

import useOverlay from '../hooks/useOverlay';
import useAuth from '../hooks/useAuth';
import useCart from '../hooks/useCart';
import useProduct from '../hooks/useProduct';


import { truncateText, formatPrice } from '../utils/formatters';
import CartQtyCtrl from "./CartQtyCtrl";
import StarRating from "./StarRating";


export default function Products() {

  const { setMsg } = useOverlay();
  const { auth } = useAuth();
  const { cart, addToCart } = useCart();
  const { products, deleteProduct, getProducts, getProductsByCategory } = useProduct();

  const [productsToDisplay, setProductsToDisplay] = useState([]);

  const navigate = useNavigate();

  const { brand, category, searchKey } = useParams();


  useEffect(() => {
    const filterProducts = async () => {
      let filtered = [];

      if (category) {
        // fetch filtered products by category
        filtered = await getProductsByCategory(category);
      } else {
        // use products state
        filtered = [...products];

        if (brand) {
          filtered = filtered.filter(product =>
            product.brand?.toLowerCase() === brand.toLowerCase()
          );
        }

        if (!brand && searchKey && searchKey.trim()) {
          filtered = filtered.filter(product =>
            product.title.toLowerCase().includes(searchKey.toLowerCase())
          );
        }

      }

      setProductsToDisplay(filtered);
    };

    filterProducts();
  }, [category, brand, searchKey, products]);


  return (
    <ul className="product-list row row-cols-2 row-cols-sm-3 row-cols-md-4 row-cols-lg-6 g-1 mt-1 py-1 px-0 px-md-1">
      {productsToDisplay.map(product => { console.log("entr prdct: >>>", product)
        // const in_cart = cart && cart.products.find(item => item.product_id === product.id);
        const crtItem = cart?.products.find(item => item.product_id === product.id);
        const showcaseImg = product.images.find(image => image.is_showcase)

        return (
          <li key={product.id} className="col">
            <div className="card h-100">
              <img src={showcaseImg.url} alt="product image" className="bd-placeholder-img card-img-top product-img mx-auto"
                // style={{width: '15rem' , height:'16rem'}}

                onClick={() => {
                  navigate(`/${product.id}`);
                }}
              />
              {/*    truncateText(item.characteristics, 68)   */}
              <div className="card-body py-0">
                <h6 className="card-title my-0">{product.title}</h6>
                <StarRating rating={product.average_rating} count={product.review_count}/>
                <small className="card-text">{truncateText(product.characteristics, 96 - product.title.length)}</small>

                <div style={{ fontSize: "20px", fontWeight: "bold" }}>
                  ${Number(product.price).toFixed(2)}
                </div>
                <div>{product.inventory > 0 ?
                  product.inventory <= 5 ?
                    <small style={{ color: "red" }}>Only {product.inventory} left</small>
                    : <small>In Stock</small>
                  : <small style={{ color: "red" }}>Out of Stock</small>}
                </div>              
              </div>
              <div className="card-footer p-0" style={{ border: 'none' }}>
                {cart && crtItem ? (
                  <CartQtyCtrl item={crtItem} />
                ) : (
                  <button className="qty-control d-flex justify-content-center align-items-center border rounded-pill py-2 px-0 px-md-1 px-lg-2 bg-light w-100"
                    style={{ maxWidth: '10rem', margin: '0 auto', cursor: 'pointer' }}
                    onClick={() => { addToCart(product.id, 1) }}
                    disabled={product.inventory === 0}
                  >
                    <strong className="text-center">Add to cart</strong>
                  </button>
                )}
              </div>
            </div>
          </li>
        )

      })

      }


    </ul>
  )
}
