import React, { useEffect, useState } from "react";
import { Spinner, Container, Col } from "react-bootstrap";
import { useAuth0 } from "@auth0/auth0-react";
import axios from "axios";

function Dashboard() {
  const { user, isAuthenticated, getAccessTokenSilently } = useAuth0();
  const [apiUser, setApiUser] = useState(null);

  const updateAuthUserMetadata = async (data) => {
    const domain = "dev-l0qhbike.us.auth0.com";

    try {
      const accessToken = await getAccessTokenSilently({
        audience: `https://${domain}/api/v2/`,
        scope: "update:current_user_metadata",
      });

      const options = {
        method: "PATCH",
        url: `https://${domain}/api/v2/users/${user.sub}`,
        headers: {
          authorization: `Bearer ${accessToken}`,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        data: { user_metadata: { api_user_id: data.id } },
      };

      await axios(options);
    } catch (e) {
      console.log(e.message);
    }
  };

  useEffect(() => {
    const getOrCreateUser = async () => {
      try {
        const accessToken = await getAccessTokenSilently({
          audience: `https://project-remina/`,
        });
        const options = {
          method: "POST",
          url: `${process.env.REACT_APP_API_URL}/users.json`,
          headers: {
            Authorization: `Bearer ${accessToken}`,
            accept: "application/json",
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: { user: { username: user.sub } },
        };
        const response = await axios(options);
        setApiUser(response.data);
        updateAuthUserMetadata(response.data);
      } catch (error) {
        console.log(error.message);
      }
    };

    getOrCreateUser();
  }, [user]);

  if (!apiUser && isAuthenticated) {
    return (
      <Container fluid>
        <Col className="justify-content-md-center">
          <Spinner animation="border" role="status">
            <span className="sr-only">Loading...</span>
          </Spinner>
        </Col>
      </Container>
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
