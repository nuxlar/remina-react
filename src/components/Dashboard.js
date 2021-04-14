import React, { useEffect, useState } from "react";
import { Spinner, Container, Col, Row, ProgressBar } from "react-bootstrap";
import { useAuth0 } from "@auth0/auth0-react";
import axios from "axios";
import GoalPage from "./goals/GoalPage";

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

  const getOrCreateUser = async () => {
    try {
      const accessToken = await getAccessTokenSilently({
        audience: `https://project-remina/`,
      });
      const options = {
        method: "POST",
        url: `${process.env.REACT_APP_API_URL}/users`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        data: { user: { username: user.sub } },
      };
      const response = await axios(options);
      setApiUser(response.data);
      updateAuthUserMetadata(response.data);
    } catch (error) {
      console.log(error.message);
    }
  };

  const getApiUser = async (pk) => {
    try {
      const accessToken = await getAccessTokenSilently({
        audience: `https://project-remina/`,
      });
      const options = {
        method: "POST",
        url: `${process.env.REACT_APP_API_URL}/users/${pk}`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      };
      const response = await axios(options);
      setApiUser(response.data);
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
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
        <Container>
          <Row className="justify-content-md-center">
            <Col>
              <h2>Your Dashboard</h2>
            </Col>
          </Row>
          <Row className="justify-content-md-center">
            <Col>
              <h3>
                Level {apiUser.level} | {apiUser.xp}/{apiUser.xp_to_lvlup}XP
              </h3>
              <ProgressBar
                animated
                max={apiUser.xp_to_lvlup}
                now={apiUser.xp}
              />
            </Col>
          </Row>
          <Row>
            <GoalPage apiUser={apiUser} />
          </Row>
          <Row></Row>
          <Row></Row>
        </Container>
      ) : (
        <>
          {" "}
          <h2>Home Page (Login/Sign Up to get started!)</h2>
        </>
      )}
    </div>
  );
}
export default Dashboard;
