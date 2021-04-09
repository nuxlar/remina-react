import React, { useState, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import axios from "axios";
import {
  Table,
  Form,
  Row,
  Button,
  Col,
  Container,
  Spinner,
  Alert,
} from "react-bootstrap";

function HabitPage() {
  const { user, isAuthenticated, getAccessTokenSilently } = useAuth0();
  const [habits, setHabits] = useState(null);
  const [userMetadata, setUserMetadata] = useState(null);
  const [editHabit, setEditHabit] = useState(null);
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

  const getHabits = async () => {
    try {
      const accessToken = await getAccessTokenSilently({
        audience: `https://project-remina/`,
      });
      const options = {
        method: "GET",
        url: `${process.env.REACT_APP_API_URL}/habits?username=${user.sub}`,
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
      };
      const response = await axios(options);
      setHabits(response.data);
    } catch (error) {
      <Alert variant="danger">{error.message}</Alert>;
    }
  };

  useEffect(() => {
    getHabits();
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
      url: `${process.env.REACT_APP_API_URL}/habits`,
      data: formDataObj,
      headers: {
        authorization: `Bearer ${accessToken}`,
      },
    };
    const res = await axios(options);
    if (res.status === 201) {
      // Fetch habits again and close the form
      await getHabits();
      setShowForm(false);
    } else {
      // display an error message
      <Alert variant="danger">{res}</Alert>;
    }
  };

  const handleSubmitE = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const formDataObj = Object.fromEntries(formData.entries());
    formDataObj.id = editHabit.id;
    formDataObj.user = userMetadata.api_user_id;
    const accessToken = await getAccessTokenSilently({
      audience: `https://project-remina/`,
    });
    const options = {
      method: "PATCH",
      url: `${process.env.REACT_APP_API_URL}/habits/${formDataObj.id}`,
      data: formDataObj,
      headers: {
        authorization: `Bearer ${accessToken}`,
      },
    };
    const res = await axios(options);
    if (res.status === 200) {
      // Fetch habits again and close the form
      await getHabits();
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
      url: `${process.env.REACT_APP_API_URL}/habits/${e.target.parentElement.parentElement.id}`,
      headers: {
        authorization: `Bearer ${accessToken}`,
      },
    };
    const res = await axios(options);
    if (res.status === 204) {
      // Fetch habits again
      await getHabits();
    } else {
      // display an error message
      <Alert variant="danger">{res}</Alert>;
    }
  };

  const handleCheckAdd = async (e) => {
    const check = { habit: e.target.parentElement.parentElement.id };
    const accessToken = await getAccessTokenSilently({
      audience: `https://project-remina/`,
    });
    const options = {
      method: "POST",
      url: `${process.env.REACT_APP_API_URL}/checks`,
      data: check,
      headers: {
        authorization: `Bearer ${accessToken}`,
      },
    };
    const res = await axios(options);
    if (res.status === 201) {
      // Fetch habits again
      await getHabits();
    } else {
      // display an error message
      <Alert variant="danger">{res}</Alert>;
    }
  };

  const handleEdit = (habitId) => {
    const editHabit = habits.find((habit) => habit.id === parseInt(habitId));
    setEditHabit(editHabit);
    setShowFormE(false);
  };

  const handleToggle = (e) => {
    if (editHabit) {
      setEditHabit(null);
      setShowFormE(true);
    } else {
      setShowForm(!showForm);
    }
  };

  return (
    <Container>
      <Row className="justify-content-md-center">
        <Col>
          <h2>Habits Page</h2>
          <Button variant="primary" onClick={(e) => handleToggle(e)}>
            Add Habit &#43;
          </Button>
        </Col>
      </Row>
      {editHabit ? (
        <Form hidden={showFormE} onSubmit={handleSubmitE}>
          <Form.Group as={Row} controlId="formHorizontalHabit">
            <Form.Label column sm={2}>
              Edit
            </Form.Label>
            <Col sm={7}>
              <Form.Control
                type="text"
                name="description"
                defaultValue={editHabit.description}
              />
            </Col>
            <Col sm={3}>
              <Button type="submit">Submit</Button>
            </Col>
          </Form.Group>
        </Form>
      ) : (
        <Form hidden={showForm} onSubmit={handleSubmit}>
          <Form.Group as={Row} controlId="formHorizontalHabit">
            <Form.Label column sm={2}>
              New
            </Form.Label>
            <Col sm={7}>
              <Form.Control
                type="text"
                placeholder="Habit Description"
                name="description"
                defaultValue={null}
              />
            </Col>
            <Col sm={3}>
              <Button type="submit">Submit</Button>
            </Col>
          </Form.Group>
        </Form>
      )}
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Description</th>
            <th>Monday</th>
            <th>Tuesday</th>
            <th>Wednesday</th>
            <th>Thursday</th>
            <th>Friday</th>
            <th>Saturday</th>
            <th>Sunday</th>
          </tr>
        </thead>
        <tbody>
          {habits
            ? habits.map((habit) => (
                <tr key={habit.id} id={habit.id}>
                  <td onClick={(e) => handleEdit(e.target.parentElement.id)}>
                    <Button variant="danger" onClick={handleDelete}>
                      Delete
                    </Button>
                    {habit.description}
                    {habit.flags.todayCompleted ? null : (
                      <Button variant="primary" onClick={handleCheckAdd}>
                        Add
                      </Button>
                    )}
                  </td>
                  {habit.checks.map((check, index) => (
                    <td key={index}>{typeof check !== "number" ? "O" : "X"}</td>
                  ))}
                </tr>
              ))
            : "You don't have any habits yet!"}
        </tbody>
      </Table>
    </Container>
  );
}

export default HabitPage;
