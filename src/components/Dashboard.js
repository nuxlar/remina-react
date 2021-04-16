import React, { useEffect, useState } from "react";
import { Spinner, Container, Col, Row, ProgressBar } from "react-bootstrap";
import { useAuth0 } from "@auth0/auth0-react";
import axios from "axios";
import GoalPage from "./goals/GoalPage";
import HabitPage from "./habits/HabitPage";
import TodoPage from "./todos/TodoPage";

function Dashboard() {
  const { user, isAuthenticated, getAccessTokenSilently } = useAuth0();
  const [apiUser, setApiUser] = useState(null);

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
    } catch (error) {
      console.log(error.message);
    }
  };

  const getApiUser = async () => {
    try {
      const accessToken = await getAccessTokenSilently({
        audience: `https://project-remina/`,
      });
      const options = {
        method: "GET",
        url: `${process.env.REACT_APP_API_URL}/users/${apiUser.id}`,
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
      <Container fluid className="spinnerContainer">
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
          <hr className="solid" />
          <Row>
            <GoalPage apiUser={apiUser} getApiUser={getApiUser} />
          </Row>
          <hr className="solid" />
          <Row>
            <HabitPage apiUser={apiUser} getApiUser={getApiUser} />
          </Row>
          <hr className="solid" />
          <Row>
            <TodoPage apiUser={apiUser} getApiUser={getApiUser} />
          </Row>
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
