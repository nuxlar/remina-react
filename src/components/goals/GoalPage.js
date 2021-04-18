import React, { useState, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { BsPlus, BsTrash } from "react-icons/bs";
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

function GoalPage(props) {
  const { user, isAuthenticated, getAccessTokenSilently } = useAuth0();
  const [data, setData] = useState(null);
  const [editGoal, setEditGoal] = useState(null);
  const [showForm, setShowForm] = useState(true);
  const [showFormE, setShowFormE] = useState(true);

  const getGoals = async () => {
    try {
      const accessToken = await getAccessTokenSilently({
        audience: `https://project-remina/`,
      });
      const options = {
        method: "GET",
        url: `${process.env.REACT_APP_API_URL}/goals?username=${user.sub}`,
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
  }, [user]);

  if (!isAuthenticated)
    return (
      <Container fluid className="spinnerContainer">
        <Col>
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
    formDataObj.user = props.apiUser.id;
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
    console.log(e.target);
    console.log(e.target.type);
    let goalId;

    if (e.target.type) {
      goalId = e.target.parentElement.parentElement.id;
    } else {
      goalId =
        e.target.parentElement.parentElement.parentElement.parentElement.id;
    }

    const accessToken = await getAccessTokenSilently({
      audience: `https://project-remina/`,
    });
    const options = {
      method: "DELETE",
      url: `${process.env.REACT_APP_API_URL}/goals/${goalId}`,
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
      props.getApiUser();
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
    formDataObj.user = props.apiUser.id;
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
        <Col xs={12}>
          <h2>Goals</h2>
        </Col>
        <Col xs={5}>
          <p className="mb-2 text-muted">
            You can add a goal for today, this week, or this month.
          </p>
        </Col>
        <Col xs={1}>
          <Button
            variant="primary"
            onClick={handleToggle}
            disabled={data ? data.stopper : true}
            size="sm"
          >
            <BsPlus size={25} />
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
            <option value="day" disabled={data ? data.dayDisable : true}>
              Day
            </option>
            <option value="week" disabled={data ? data.weekDisable : true}>
              Week
            </option>
            <option value="month" disabled={data ? data.monthDisable : true}>
              Month
            </option>
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
            <option value="day" disabled={data ? data.dayDisable : true}>
              Today
            </option>
            <option value="week" disabled={data ? data.weekDisable : true}>
              This week
            </option>
            <option value="month" disabled={data ? data.monthDisable : true}>
              This month
            </option>
          </Form.Control>
          <Button variant="primary" type="submit">
            Submit
          </Button>
        </Form>
      )}
      {data && data.goals
        ? data.goals.map((goal) => {
            return (
              <Container key={goal.id}>
                <h5>{`This ${goal.timePeriod}'s goal: `}</h5>
                <Row id={goal.id}>
                  <Col>
                    <FormCheck type="checkbox" onChange={handleMarkCompleted} />
                  </Col>
                  <Col>
                    <Button
                      variant="secondary"
                      onClick={handleEdit}
                    >{`${goal.description}`}</Button>
                  </Col>
                  <Col>
                    <Button variant="danger" onClick={handleDelete}>
                      <BsTrash size={20} />
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
