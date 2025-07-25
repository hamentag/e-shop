// src/components/Products.jsx

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

import useOverlay from '../hooks/useOverlay';
import useAuth from '../hooks/useAuth';
import useCart from '../hooks/useCart';
import useProducts from '../hooks/useProducts';
import useSearch from "../hooks/useSearch";


export default function Products(){

  const { setMsg } = useOverlay();
  const { auth } = useAuth();
  const { cart, addToCart } = useCart();
  const { products, deleteProduct } = useProducts();

  const [productsToDisplay, setProductsToDisplay] = useState([]);
    
  const navigate = useNavigate();

  // const { seller } = useParams();
  const { brand, category } = useParams();

  const { searchParam, setSearchParam } = useSearch();
  
  
  // useEffect(()=>{
  //   if(seller === 'all'){
  //     setProductsToDisplay(products)
  //   }
  //   else{
  //     setProductsToDisplay(products.filter(prd => prd.brand === seller))
  //   }

  // },[seller])


  // useEffect(()=>{
  //   if (seller !== 'all') {
  //     setProductsToDisplay(products.filter(prd => prd.brand === seller))
  //     return
  //   }

  //   if (searchParam.trim()) {
  //     setProductsToDisplay(
  //           products.filter((product) =>
  //       product.title.toLowerCase().includes(searchParam.toLowerCase()))
            
  //     )
  //     return
  //   }
  //   setProductsToDisplay(products)


  // },[seller, searchParam])


  

  useEffect(() => {
    let urlPrds = products;

    if (searchParam.trim()) {
      urlPrds = urlPrds.filter((product) =>
        product.title.toLowerCase().includes(searchParam.toLowerCase())
      );
    } else if (brand) {
      urlPrds = urlPrds.filter((prd) => prd.brand === brand);
    } else if (category) {
      urlPrds = urlPrds.filter((prd) => prd.category === category);
    }

    setProductsToDisplay(urlPrds);
 
  }, [products, brand, category, searchParam]);





  return (
      <ul className='products'>
      {
        productsToDisplay.map( product => {
          const in_cart = cart && cart.products.find(item => item.product_id === product.id);
          const showcaseImg = product.images.find(image => image.is_showcase)
          return (
            <li key={ product.id }>
              <h4 onClick={() => {
                        navigate(`/${product.id}`);
                        }}>{ product.title }</h4>
              
              <img src={showcaseImg.url} alt="product image" 
                    style={{width: '15rem' , height:'16rem'}}
                    onClick={() => {
                    navigate(`/${product.id}`);
                    }}
              />
              <div style={{fontSize:"20px", fontWeight:"bold"}}>
              ${product.price}
              </div>
              <div>{product.inventory > 0 ?
                product.inventory <= 5 ?
                  <div style={{ color: "red" }}>Only {product.inventory} left</div>
                    : <div>In Stock</div>
                  : <div>Out of Stock</div>}
              </div>
              <button onClick={()=> { addToCart(product.id,1) }}>{in_cart? "In Cart - Add More" : "Add to cart"}</button>  
              {
                auth.is_admin && 
                <button 
                  className="admin-delete-btn"
                  onClick={()=>{
                    setMsg({ txt: `Are you sure you want to delete "${product.title}" from the product list?`, 
                                more: <button onClick={() => {deleteProduct(product.id); setMsg(null); navigate('/') }}>Yes</button>
                    });
                    }} >Delete
                </button>
              }
            </li>
          );
        })
      }
    </ul>        
  )
}
