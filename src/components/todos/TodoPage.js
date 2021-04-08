import React, { useState, useEffect } from "react";
import TodoModal from "./TodoModal";
import { postTodo, deleteTodo, patchTodo } from "../../api/apiCalls";
import { useAuth0 } from "@auth0/auth0-react";
import axios from "axios";

import {
  Spinner,
  Container,
  Row,
  Button,
  Card,
  Form,
  FormCheck,
  CardColumns,
  Col,
} from "react-bootstrap";

function TodoPage() {
  const { user, isAuthenticated, getAccessTokenSilently } = useAuth0();
  const [todos, setTodo] = useState(null);
  const [modalShow, setModalShow] = useState(false);
  const [editTodo, setEditTodo] = useState(null);
  const [filter, setFilter] = useState("Uncompleted");

  useEffect(() => {
    const trying = async () => {
      try {
        const accessToken = await getAccessTokenSilently({
          audience: `https://project-remina/`,
        });
        const response = await axios.post(
          "http://localhost:8000/users",
          { user: { username: user.sub } },
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        setTodo(response.data);
      } catch (error) {
        console.log(error.message);
      }
    };

    trying();
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
    // TODO: fill with actual user once auth and etc.. is added
    formDataObj.user = 1;
    const res = await postTodo(formDataObj);
    if (res.status === 201) {
      // Fetch todos again and close the modal

      setModalShow(false);
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
    formDataObj.id = parseInt(e.target.offsetParent.id);
    const res = await patchTodo(formDataObj);
    if (res.status === 200) {
      // Fetch todos again and close the modal

      toggleModal();
    } else {
      // display an error message
      alert(res);
    }
  };

  const handleMarkCompleted = async (e) => {
    const todoId = parseInt(e.target.parentElement.offsetParent.id);
    const todo = todos.find((element) => element.id === todoId);
    const editTodo = { completed: !todo.completed, id: todoId };
    const res = await patchTodo(editTodo);
    if (res.status === 200) {
      // Fetch todos again and close the modal
    } else {
      // display an error message
      alert(res);
    }
  };

  const handleDelete = async (e) => {
    const res = await deleteTodo(e.target.offsetParent.id);
    if (res.status === 204) {
      // Fetch todos again
    } else {
      // display an error message
      alert(res);
    }
  };

  const handleEditModal = (todoId) => {
    const editTodo = todos.find((todo) => todo.id === parseInt(todoId));
    setEditTodo(editTodo);
    setModalShow(true);
  };

  const toggleModal = () => {
    setEditTodo(null);
    setModalShow(!modalShow);
  };

  const todosFilter = (filter, todo) => {
    if (filter === "Completed") {
      return todo.completed;
    } else {
      return !todo.completed;
    }
  };

  return (
    <Container>
      <Row className="justify-content-md-center">
        <Col>
          <h2>Todos Page</h2>
        </Col>
        <Col>
          <Button variant="primary" onClick={toggleModal}>
            Add Todo &#43;
          </Button>
        </Col>
      </Row>

      <div>
        <Form.Group as={Form.Row}>
          <Form.Label column sm={3}>
            Filter:
          </Form.Label>
          <Col sm={9}>
            <Form.Control
              as="select"
              onChange={(e) => setFilter(e.target.value)}
            >
              <option>Uncompleted</option>
              <option>Completed</option>
            </Form.Control>
          </Col>
        </Form.Group>
      </div>
      <CardColumns>
        {todos
          .filter((todo) => todosFilter(filter, todo))
          .map((todo) => (
            <Card style={{ width: "18rem" }} id={todo.id} key={todo.id}>
              <Card.Body>
                <Card.Title>{todo.description}</Card.Title>
                <Card.Subtitle className="mb-2 text-muted">
                  {todo.xp}XP
                </Card.Subtitle>
                {todo.dueDate && (
                  <Card.Subtitle className="mb-2 text-muted">
                    {todo.dueDate}
                  </Card.Subtitle>
                )}
                {todo.dueTime && (
                  <Card.Subtitle className="mb-2 text-muted">
                    {todo.dueTime}
                  </Card.Subtitle>
                )}
                <FormCheck
                  type="checkbox"
                  label="Completed"
                  onChange={handleMarkCompleted}
                  defaultChecked={todo.completed}
                />
                <Button
                  variant="secondary"
                  onClick={(e) => handleEditModal(e.target.offsetParent.id)}
                >
                  Edit
                </Button>
                <Button variant="danger" onClick={handleDelete}>
                  Delete
                </Button>
              </Card.Body>
            </Card>
          ))}
      </CardColumns>
      <TodoModal
        show={modalShow}
        todo={editTodo}
        handleSubmit={(e) => handleSubmit(e)}
        handleSubmitE={(e) => handleSubmitE(e)}
        onHide={toggleModal}
      />
    </Container>
  );
}

export default TodoPage;
