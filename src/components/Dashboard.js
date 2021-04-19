import React, { useEffect, useState } from "react";
import {
  Spinner,
  Container,
  Col,
  Row,
  ProgressBar,
  Jumbotron,
  CardDeck,
  Card,
} from "react-bootstrap";
import { useAuth0 } from "@auth0/auth0-react";
import axios from "axios";
import GoalPage from "./goals/GoalPage";
import HabitPage from "./habits/HabitPage";
import TodoPage from "./todos/TodoPage";
import LoginButton from "../auth/LoginButton";

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
      <Container fluid classNameName="spinnerContainer">
        <Col classNameName="justify-content-md-center">
          <Spinner animation="border" role="status">
            <span classNameName="sr-only">Loading...</span>
          </Spinner>
        </Col>
      </Container>
    );
  }

  return (
    <>
      {isAuthenticated && apiUser ? (
        <Container>
          <Row classNameName="justify-content-md-center">
            <Col>
              <h2>Your Dashboard</h2>
            </Col>
          </Row>
          <Row classNameName="justify-content-md-center">
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
          <hr classNameName="solid" />
          <Row>
            <GoalPage apiUser={apiUser} getApiUser={getApiUser} />
          </Row>
          <hr classNameName="solid" />
          <Row>
            <HabitPage apiUser={apiUser} getApiUser={getApiUser} />
          </Row>
          <hr classNameName="solid" />
          <Row>
            <TodoPage apiUser={apiUser} getApiUser={getApiUser} />
          </Row>
        </Container>
      ) : (
        <>
          <Jumbotron fluid className="home-jumbotron">
            <div className="jumbotron-content">
              <h1>Project Remina</h1>
              <p>An app made to level up your productivity</p>
              <LoginButton />
            </div>
          </Jumbotron>
          <CardDeck>
            <Card style={{ height: "300px" }}>
              <Card.Body>
                <Card.Title>Instant feedback loop</Card.Title>
                <Card.Subtitle className="mb-2 text-muted">
                  Why was it made?
                </Card.Subtitle>
                <Card.Text>
                  I've always wished there could be a real-life leveling system
                  and that's what project remina is for productivity. By
                  receiving XP and leveling up for doing things you'd normally
                  do, you have a tangible, fun way of making progress.
                </Card.Text>
              </Card.Body>
              <Card.Footer>
                <small className="text-muted">{"Made with love <3"}</small>
              </Card.Footer>
            </Card>
            <Card>
              <Card.Body>
                <Card.Title>Goals, Habits, To-dos</Card.Title>
                <Card.Subtitle className="mb-2 text-muted">
                  How productivity is tracked
                </Card.Subtitle>
                <Card.Text>
                  These are 3 ways project remina helps level up your
                  productivity. You're able to create a goal for today, this
                  week, and this month, track habits for the week, and manage
                  good ol' to-dos.
                </Card.Text>
              </Card.Body>
              <Card.Footer>
                <small className="text-muted">Pillars of productivity</small>
              </Card.Footer>
            </Card>
            <Card>
              <Card.Body>
                <Card.Title>What it's made with</Card.Title>
                <Card.Subtitle className="mb-2 text-muted">
                  Fun tech stuff
                </Card.Subtitle>
                <Card.Text>
                  The frontend is built with React (Javascript ES6) while the
                  API is written in Django (Python 3) that uses a Postgres
                  database. Authentication is performed using a 3rd party app
                  called Auth0.
                </Card.Text>
              </Card.Body>
              <Card.Footer>
                <small className="text-muted">Beep boop</small>
              </Card.Footer>
            </Card>
          </CardDeck>
        </>
      )}
    </>
  );
}
export default Dashboard;
