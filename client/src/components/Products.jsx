// src/components/Products.jsx

import { useParams } from "react-router-dom";
import useCart from "../hooks/useCart";
import ProductCard from "./ProductCard";
import ProductCarousel from "./ProductCarousel";
import useFilteredProducts from "../hooks/useFilteredProducts";

export default function Products() {
  const { brand, category, searchKey } = useParams();
  const { cart } = useCart();
  const { filteredProducts, loading } = useFilteredProducts({ brand, category, searchKey });

  if (loading || !cart) {
    return (
      <div className="d-flex justify-content-center my-5">
        <div className="spinner-grow" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  const shouldShowCarousel = !brand && !category && !searchKey;

  if (!shouldShowCarousel)
    return (
      <ul className="product-list row row-cols-2 row-cols-sm-3 row-cols-md-4 g-1 mt-1 py-1 px-0 px-md-2 px-md3"> 
        {
          filteredProducts.map(product => (
            <li key={product.id} className="col">
              <ProductCard product={product} />
            </li>
          ))
        }
      </ul>
    );
  
  const topTwelve = filteredProducts.slice(0, 12);
  const remaining = filteredProducts.slice(12);

  return (
   <>
      <ul className="product-list row row-cols-2 row-cols-sm-3 row-cols-md-4 g-1 mt-1 py-1 px-0 px-md-2 px-md3">     
      {topTwelve.map(product => (
        <li key={product.id} className="col">
          <ProductCard product={product} />
        </li>
      ))}

    </ul>

    <div>
      <ProductCarousel
            title="You might also like"
            renderItem={item => (
              <div className="scroller-card-wrapper">
                <ProductCard product={item} />
              </div>
            )}
            products={filteredProducts}
          />
    </div>

      

     <ul className="product-list row row-cols-2 row-cols-sm-3 row-cols-md-4 g-1 mt-1 py-1 px-0 px-md-2 px-md3">  
      {remaining.map(product => (
        <li key={product.id} className="col">
          <ProductCard product={product} />
        </li>
      ))}
    </ul>
   </>
  );
}
