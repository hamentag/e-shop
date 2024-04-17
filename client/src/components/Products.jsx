import { useState, useEffect } from "react";

import { useParams, Routes, Route, Link, useNavigate } from "react-router-dom";

export default function Products({auth, cart, setMsg, addToCart, removeFromCart, products, deleteProduct}){
    
    const navigate = useNavigate();
    
    return (
        <ul className='products'>
        {
          products.map( product => {
            const soughtProduct = cart.find(item => item.product_id === product.id);
            return (
              <li key={ product.id }>
                <div  className={ soughtProduct ? 'in-cart': 'not-in-cart'}>
                  <h4>{ product.title }</h4>
                  <div className="product-card">
                    <img src={product.image} alt="product image" style={{width: '185px' , height:'125px'}}/>
                    <div>
                        <button onClick={() => {
                            navigate(`/${product.id}`);
                            }}>Details
                        </button>
                        <button onClick={()=> { addToCart(product.id,1) }}>Add to cart</button>  
                        {
                          auth.is_admin && <button onClick={()=>{
                            setMsg({ txt: `Are you sure you want to delete "${product.title}" from the product list?`, 
                                        more: <button onClick={() => {deleteProduct(product.id); setMsg(null); navigate('/') }}>Yes</button>
                            });
                            }} className="delete-btn">Delete
                        </button>
                        }
                    </div>
                  </div>
                </div>
              </li>
            );
          })
        }
      </ul>        
    )
}