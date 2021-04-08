import React, { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import Button from "react-bootstrap/Button";
import axios from "axios";
import { getOrCreateUser } from "../api/apiCalls";

function Dashboard() {
  const { user, getAccessTokenSilently } = useAuth0();
  const [apiUser, setApiUser] = useState(null);

  const trying = async (authId) => {
    const accessToken = await getAccessTokenSilently({
      audience: `https://project-remina/`,
    });
    console.log(accessToken);
    const response = await axios.post(
      "http://localhost:8000/users",
      { user: { username: authId } },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    setApiUser(response.data);
  };

  if (!apiUser) {
    return (
      <div>
        Loading...<Button onClick={() => trying(user.sub)}>Get Info</Button>
      </div>
    );
  }

  return (
    <div>
      {/* {isAuthenticated ? ( */}
      <>
        <h2>Dashboard Page</h2>
        <h3>{apiUser}</h3>
      </>
      {/* ) : (
        <>
          {" "}
          <h2>Home Page</h2>
          <h3>About</h3>
        </> */}
      {/* )} */}
    </div>
  );
}
export default Dashboard;
