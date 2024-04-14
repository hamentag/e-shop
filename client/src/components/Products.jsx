import { useState, useEffect } from "react";

import {  useNavigate } from "react-router-dom";

export default function Products({products}){
    
    const navigate = useNavigate();
    
    return (
        <ul className='products'>
        {
          products.map( product => {
           
            return (
              <li key={ product.id }>
                <div >
                  <h4>{ product.title }</h4>
                  <div className="product-card">
                    <img src={product.image} alt="product image" style={{width: '185px' , height:'125px'}}/>
                    <div>
                        <button onClick={() => {
                            navigate(`/${product.id}`);
                            }}>Details
                        </button>
                        
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