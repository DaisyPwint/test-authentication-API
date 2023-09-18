import { useEffect, useState } from "react";
import useAuth from "../hook/useAuth";
import axios from "../api/axios";

const Users = () => {
  const { auth} = useAuth();
  const [userData,setUserData] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try{
        const response = await axios.get('/users',{
          headers: {
            Authorization: `Bearer ${auth.accessToken}`,
          }
        })
        setUserData(response?.data);
        console.log(response?.data);
      }catch(error){
        console.error("Error fetching user data:",error);
      }
    }

    if (auth && auth.accessToken) {
      fetchUserData();
      console.log('user logged in');
    } else {
      console.log('user not logged in');      
    }
  }, [auth]);

  console.log(userData);

  return (
    <div>
      <h2>All User Data</h2>
      {
        userData ? userData?.data.map((user) => {
          return <>
            <p>User Name and Email: {user.name} {user.email}</p>
          </>
        }
        ) : (
          <div>
            <p>User not logged in</p>
            <a href="/login">Login</a>
          </div>
        )
      }
    </div>
  );
}

export default Users;
