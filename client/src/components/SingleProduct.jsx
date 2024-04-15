
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function SingleProduct({}){

    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    
    useEffect(()=> {
        const fetchSingleProduct = async()=> {
          const response = await fetch(`/api/products/${id}`);
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
            <div> 
                {product &&
                    <>
                        <h3>Product Details "{product.title}"</h3>
                        <div>
                            <div>
                                <img src={product.image} alt="image" style={{width: '320px' , height:'185px'}}/>
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
                                            <th scope="row">Description</th>
                                            <td>{product.description}</td>
                                        </tr>
                                        <tr>
                                            <th scope="row">Inventory</th>
                                            <td>{product.inventory}</td>
                                        </tr>
                                    
                                    </tbody>
                                </table>
                                
                            </div>
                            
                        </div>
                        
                    </>
                }
            </div>
        }            
        </>
      )
}