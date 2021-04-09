import React, { useState } from "react";
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
} from "react-bootstrap";
import {
  getHabits,
  postHabit,
  patchHabit,
  deleteHabit,
  postCheck,
} from "../hooks/apiCalls";

function HabitPage() {
  const { user, isAuthenticated, getAccessTokenSilently } = useAuth0();
  const [habits, setHabits] = useState(null);
  const [editHabit, setEditHabit] = useState(null);
  const [showForm, setShowForm] = useState(true);
  const [showFormE, setShowFormE] = useState(true);

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
    // TODO: fill with actual user once auth and etc.. is added
    formDataObj.user = 1;

    const res = await postHabit(formDataObj);
    if (res.status === 201) {
      // Fetch habits again and close the form
      setShowForm(false);
    } else {
      // display an error message
      alert(res);
    }
  };

  const handleSubmitE = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const formDataObj = Object.fromEntries(formData.entries());
    // TODO: fill with actual user once auth and etc.. is added
    formDataObj.user = 1;
    formDataObj.id = editHabit.id;
    const res = await patchHabit(formDataObj);
    if (res.status === 200) {
      // Fetch habits again and close the form

      setShowForm(true);
    } else {
      // display an error message
      console.log(res);
      alert(res);
    }
  };

  const handleDelete = async (e) => {
    const res = await deleteHabit(e.target.parentElement.parentElement.id);
    if (res.status === 204) {
      // Fetch habits again
    } else {
      // display an error message
      alert(res);
    }
  };

  const handleCheckAdd = async (e) => {
    const check = { habit: e.target.parentElement.parentElement.id };
    const res = await postCheck(check);
    if (res.status === 201) {
      // Fetch habits again
    } else {
      // display an error message
      alert(res);
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
          {habits.map((habit) => (
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
          ))}
        </tbody>
      </Table>
    </Container>
  );
}

export default HabitPage;
