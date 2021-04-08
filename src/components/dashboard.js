import React, { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import Button from "react-bootstrap/Button";
import axios from "axios";
import { getOrCreateUser } from "../api/apiCalls";

function Dashboard() {
  const { user, isAuthenticated, getAccessTokenSilently } = useAuth0();
  const [apiUser, setApiUser] = useState(null);

  useEffect(() => {
    const trying = async () => {
    try {
        const accessToken = await getAccessTokenSilently({
          audience: `https://project-remina/`,
        });
        console.log(accessToken);
        const response = await axios.post(
          "http://localhost:8000/users",
          { user: { username: user.sub } },
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
      setApiUser(response.data);
    } catch (error) {
      console.log(error.message);
    }};

    trying()
  }, [user])

  if (!apiUser && isAuthenticated) {
    return (
      <div>
        Loading...
      </div>
    );
  }

  return (
    <div>
      {isAuthenticated && apiUser ? (
      <>
        <h2>Dashboard Page</h2>
        <h3>Level {apiUser.level}</h3>
      </>
      ) : (
        <>
          {" "}
          <h2>Home Page</h2>
          <h3>About</h3>
        </> 
       )} 
    </div>
  );
}
export default Dashboard;
