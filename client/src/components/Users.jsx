// const baseURL = 'https://hs-ecommerce-srv.onrender.com'
const baseURL = ''
import { useState, useEffect } from 'react'

export default function Users({auth}){
    const [users, setUsers] = useState([]);
    const [error, setError] = useState(null);

    useEffect(()=> {
        const fetchUsers= async()=> {
          const response = await fetch(`${baseURL}/api/users`);
          const json = await response.json();
          if(response.ok){
           setUsers(json)
          }
          else{
            setError(json.error)
            setMsg({txt: json.error})            
          }
        };
        fetchUsers();
      }, []);
    

    return(
        <>
            { auth.is_admin && !error && 
                <div className="users">
                    <h3>Existing Users</h3>        
                    <table className='users-table'>
                        <tbody>
                            <tr>
                                <th scope="row">Full Name </th>
                                <th scope="row">Email</th>
                                <th scope="row">Phone</th>
                                <th scope="row">Admin</th>
                                <th scope="row">Engineer</th>
                            </tr>
                            {
                                users.map(user => {
                                    return(
                                        <tr key={user.id}>
                                            <td>{user.firstname} {user.lastname}</td>
                                            <td>{user.email}</td>
                                            <td>{user.phone}</td>
                                            <td>{user.is_admin? "Yes" : "No"}</td>
                                            <td>{user.is_engineer? "Yes" : "No"}</td>
                                        </tr>
                                    )
                                })
                            }

                        </tbody>
                    </table>
                </div>
            }
        </>
    )
}