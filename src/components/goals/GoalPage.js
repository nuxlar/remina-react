import React, { useState, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import axios from "axios";
import {
  Form,
  Button,
  FormCheck,
  Row,
  Col,
  Container,
  Alert,
  Spinner,
} from "react-bootstrap";

function GoalPage() {
  const { user, isAuthenticated, getAccessTokenSilently } = useAuth0();
  const [userMetadata, setUserMetadata] = useState(null);
  const [data, setData] = useState(null);
  const [editGoal, setEditGoal] = useState(null);
  const [showForm, setShowForm] = useState(true);
  const [showFormE, setShowFormE] = useState(true);

  const getUserMetadata = async () => {
    const domain = "dev-l0qhbike.us.auth0.com";

    try {
      const accessToken = await getAccessTokenSilently({
        audience: `https://${domain}/api/v2/`,
        scope: "read:current_user",
      });

      const userDetailsByIdUrl = `https://${domain}/api/v2/users/${user.sub}`;

      const metadataResponse = await axios.get(userDetailsByIdUrl, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const user_metadata = await metadataResponse;

      setUserMetadata(user_metadata.data.user_metadata);
    } catch (e) {
      <Alert variant="danger">{e.message}</Alert>;
    }
  };

  const getGoals = async () => {
    try {
      const accessToken = await getAccessTokenSilently({
        audience: `https://project-remina/`,
      });
      const options = {
        method: "GET",
        url: `http://localhost:8000/goals?username=${user.sub}`,
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
      };
      const response = await axios(options);
      console.log(response.data);
      setData(response.data);
    } catch (error) {
      <Alert variant="danger">{error.message}</Alert>;
    }
  };

  useEffect(() => {
    getGoals();
    getUserMetadata();
  }, [user]);

  if (!isAuthenticated)
    return (
      <Container fluid>
        <Col className="justify-content-md-center">
          <Spinner animation="border" role="status">
            <span className="sr-only">Loading...</span>
          </Spinner>
        </Col>
      </Container>
    );

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const formDataObj = Object.fromEntries(formData.entries());
    formDataObj.user = userMetadata.api_user_id;
    const accessToken = await getAccessTokenSilently({
      audience: `https://project-remina/`,
    });
    const options = {
      method: "POST",
      url: `${process.env.REACT_APP_API_URL}/goals`,
      data: formDataObj,
      headers: {
        authorization: `Bearer ${accessToken}`,
      },
    };
    const res = await axios(options);
    if (res.status === 201) {
      // Fetch goals again and close the form
      await getGoals();
      setShowForm(true);
    } else {
      // display an error message
      <Alert variant="danger">{res}</Alert>;
    }
  };

  const handleDelete = async (e) => {
    const accessToken = await getAccessTokenSilently({
      audience: `https://project-remina/`,
    });
    const options = {
      method: "DELETE",
      url: `${process.env.REACT_APP_API_URL}/goals/${e.target.parentElement.parentElement.id}`,
      headers: {
        authorization: `Bearer ${accessToken}`,
      },
    };
    const res = await axios(options);
    if (res.status === 204) {
      // Fetch goals again
      await getGoals();
    } else {
      // display an error message
      <Alert variant="danger">{res}</Alert>;
    }
  };

  const handleMarkCompleted = async (e) => {
    const goalId = parseInt(
      e.target.parentElement.parentElement.parentElement.id
    );
    const editGoal = { completed: true, id: goalId };
    const accessToken = await getAccessTokenSilently({
      audience: `https://project-remina/`,
    });
    const options = {
      method: "PATCH",
      url: `${process.env.REACT_APP_API_URL}/goals/${editGoal.id}`,
      data: editGoal,
      headers: {
        authorization: `Bearer ${accessToken}`,
      },
    };
    const res = await axios(options);
    if (res.status === 200) {
      // Fetch goals again and close the modal
      await getGoals();
    } else {
      // display an error message
      <Alert variant="danger">{res}</Alert>;
    }
  };

  const handleSubmitE = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const formDataObj = Object.fromEntries(formData.entries());
    formDataObj.user = userMetadata.api_user_id;
    formDataObj.id = editGoal.id;
    const accessToken = await getAccessTokenSilently({
      audience: `https://project-remina/`,
    });
    const options = {
      method: "PATCH",
      url: `${process.env.REACT_APP_API_URL}/goals/${formDataObj.id}`,
      data: formDataObj,
      headers: {
        authorization: `Bearer ${accessToken}`,
      },
    };
    const res = await axios(options);
    if (res.status === 200) {
      // Fetch goals again and close the form
      await getGoals();
      setShowForm(true);
    } else {
      // display an error message
      <Alert variant="danger">{res}</Alert>;
    }
  };

  const handleEdit = (e) => {
    setShowForm(true);
    setEditGoal(null);
    const editGoal = data.goals.find(
      (goal) => goal.id === parseInt(e.target.parentElement.parentElement.id)
    );
    setEditGoal(editGoal);
    setShowFormE(false);
  };

  const handleToggle = (e) => {
    if (editGoal) {
      setEditGoal(null);
      setShowFormE(true);
    } else {
      setShowForm(!showForm);
    }
  };

  return (
    <Container>
      <Row className="justify-content-md-center">
        <Col>
          <h2>Goals Page</h2>
          <Button
            variant="primary"
            onClick={handleToggle}
            disabled={data ? data.stopper : true}
          >
            Add Goal &#43;
          </Button>
        </Col>
      </Row>
      {editGoal ? (
        <Form hidden={showFormE} onSubmit={handleSubmitE}>
          <Form.Label>Edit</Form.Label>
          <Form.Control
            type="text"
            name="description"
            defaultValue={editGoal.description}
          />
          <Form.Label>Type</Form.Label>
          <Form.Control
            as="select"
            name="timePeriod"
            defaultValue={editGoal.timePeriod}
          >
            <option value="day">Day</option>
            <option value="week">Week</option>
            <option value="month">Month</option>
          </Form.Control>
          <Button variant="primary" type="submit">
            Submit
          </Button>
        </Form>
      ) : (
        <Form hidden={showForm} onSubmit={handleSubmit}>
          <Form.Label>Create</Form.Label>
          <Form.Control
            type="text"
            name="description"
            placeholder="Description"
            defaultValue={null}
          />
          <Form.Label>Type</Form.Label>
          <Form.Control as="select" name="timePeriod" defaultValue={null}>
            <option value="day">Today</option>
            <option value="week">This week</option>
            <option value="month">This month</option>
          </Form.Control>
          <Button variant="primary" type="submit">
            Submit
          </Button>
        </Form>
      )}
      {data
        ? data.goals.map((goal) => {
            return (
              <Container key={goal.id}>
                <h5>{`This ${goal.timePeriod}'s goal: `}</h5>
                <Row id={goal.id}>
                  <Col sm={2}>
                    <FormCheck type="checkbox" onChange={handleMarkCompleted} />
                  </Col>
                  <Col sm={8}>
                    <Button
                      variant="secondary"
                      onClick={handleEdit}
                    >{`${goal.description}`}</Button>
                  </Col>
                  <Col sm={2}>
                    <Button variant="danger" onClick={handleDelete}>
                      X
                    </Button>
                  </Col>
                </Row>
              </Container>
            );
          })
        : "You don't have any goals yet."}
    </Container>
  );
}

export default GoalPage;
