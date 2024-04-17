
export default function Account({auth}){
    return(
        <>
            { auth.id &&
                <div className="account">
                    <h3>{auth.firstname} {auth.lastname}</h3>
                    {auth.is_admin && <div>(Admin)</div>}
                    {auth.is_engineer && <div>(Engineer)</div>}
        
                    <table>
                        <tbody>
                            <tr>
                                <th scope="row">First Name </th>
                                <td>{auth.firstname}</td>
                            </tr>
                            <tr>
                                <th scope="row">Last Name</th>
                                <td>{auth.lastname}</td>
                            </tr>
                            <tr>
                                <th scope="row">Email</th>
                                <td>{auth.email}</td>
                            </tr>
                            <tr>
                                <th scope="row">Phone</th>
                                <td>{auth.phone}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            }
        </>
    )
}