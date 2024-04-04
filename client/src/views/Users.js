import React, {useState, useEffect, Fragment} from "react";
import axios from "axios";

function HomePage() {
    const [listUsers, setListUsers] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:3002/users/').then((res) => {
            setListUsers(res.data.allUsers);
        });
    }, []);

    return (
        <>
        <div className="container-fluid">
            <h1 className="text-center">USER'S INFO</h1>
            <table className="table">
                <thead className="thead-dark">
                    <tr>
                        <th scope="col" className="text-center"> Username </th>
                        <th scope="col" className="text-center">Password</th>
                    </tr>
                </thead>
                <tbody>
                    {listUsers.map((user) => (
                        <tr key={user.id} className="text-center">
                            <td>{user.Username}</td>
                            <td>{user.Password}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
        </>
    );
};

export default HomePage;