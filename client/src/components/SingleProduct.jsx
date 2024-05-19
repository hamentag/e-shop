// const baseURL = 'https://hs-ecommerce-srv.onrender.com' 
const baseURL = ''
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function SingleProduct({auth, addToCart, deleteProduct, setMsg}){

    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    
    useEffect(()=> {
        const fetchSingleProduct = async()=> {
          const response = await fetch(`${baseURL}/api/products/${id}`);
          const json = await response.json();
          if(response.ok){
            setProduct(json);
          }
          else{
            console.error(response.error); 
            setError(response.error)         
          }
        };
        fetchSingleProduct();
      }, []);

      return(
        <>{ !error &&
            <div className="product-details"> 
                {product &&
                    <>
                        <h3>Product Details "{product.title}"</h3>
                        <div className="product-details-main">
                            <div>
                                <img src={product.image} alt="product image" style={{width: '360px' , height:'225px'}}/>
                                <table>
                                    <tbody>
                                        <tr>
                                            <th scope="row">Title</th>
                                            <td>{product.title}</td>
                                        </tr>
                                        <tr>
                                            <th scope="row">Category</th>
                                            <td>{product.category}</td>
                                        </tr>
                                        <tr>
                                            <th scope="row">Price</th>
                                            <td>${product.price}</td>
                                        </tr>
                                        <tr>
                                            <th scope="row">Dimensions</th>
                                            <td>{product.dimensions}</td>
                                        </tr>
                                        <tr>
                                            <th scope="row">characteristics</th>
                                            <td>{product.characteristics}</td>
                                        </tr>
                                        {
                                            auth.is_admin && 
                                            <tr>
                                            <th scope="row">Inventory</th>
                                            <td>{product.inventory}</td>
                                        </tr>
                                        }
                                    </tbody>
                                </table>
                                
                            </div>
                            <div>
                            {
                                product.inventory === 0 && <div style={{color: 'brown'}}>Out of Stock</div>
                            }
                            {
                                auth.id && <button 
                                    onClick={()=> { addToCart(product.id,1)  }}
                                    disabled={ product.inventory === 0 }
                                >Add to cart</button>  
                            }
                            {
                            auth.is_admin && 
                                <button onClick={()=>{
                                    setMsg({ txt: `Are you sure you want to delete "${product.title}" from the product list?`, 
                                                more: <button onClick={() => { deleteProduct(product.id); navigate('/'); setMsg(null) }}>Yes</button>
                                    });
                                    }} className="delete-btn">Delete
                                </button>
                            }
                            </div>
                        </div>
                        
                    </>
                }
            </div>
        }            
        </>
      )
}
