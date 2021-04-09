import React, { useState, useEffect } from "react";
import TodoModal from "./TodoModal";
import { postTodo, deleteTodo, patchTodo } from "../../api/apiCalls";
import { useAuth0 } from "@auth0/auth0-react";
import axios from "axios";

import {
  Alert,
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
  const [userMetadata, setUserMetadata] = useState(null);
  const [todos, setTodos] = useState(null);
  const [modalShow, setModalShow] = useState(false);
  const [editTodo, setEditTodo] = useState(null);
  const [filter, setFilter] = useState("Uncompleted");

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
      console.log(e.message);
    }
  };

  const getTodos = async () => {
    try {
      const accessToken = await getAccessTokenSilently({
        audience: `https://project-remina/`,
      });
      const options = {
        method: "GET",
        url: `http://localhost:8000/todos?username=${user.sub}`,
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
      };
      const response = await axios(options);
      setTodos(response.data);
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    getTodos();
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
      url: `${process.env.REACT_APP_API_URL}/todos`,
      data: formDataObj,
      headers: {
        authorization: `Bearer ${accessToken}`,
      },
    };
    const res = await axios(options);
    if (res.status === 201) {
      // Fetch todos again and close the modal
      await getTodos();
      setModalShow(false);
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
    formDataObj.id = parseInt(e.target.offsetParent.id);
    const accessToken = await getAccessTokenSilently({
      audience: `https://project-remina/`,
    });
    const options = {
      method: "PATCH",
      url: `${process.env.REACT_APP_API_URL}/todos/${formDataObj.id}`,
      data: formDataObj,
      headers: {
        authorization: `Bearer ${accessToken}`,
      },
    };
    const res = await axios(options);
    if (res.status === 200) {
      // Fetch todos again and close the modal
      await getTodos();
      toggleModal();
    } else {
      // display an error message
      <Alert variant="danger">{res}</Alert>;
    }
  };

  const handleMarkCompleted = async (e) => {
    const todoId = parseInt(e.target.parentElement.offsetParent.id);
    const todo = todos.find((element) => element.id === todoId);
    const editTodo = { completed: !todo.completed, id: todoId };

    const accessToken = await getAccessTokenSilently({
      audience: `https://project-remina/`,
    });
    const options = {
      method: "PATCH",
      url: `${process.env.REACT_APP_API_URL}/todos/${editTodo.id}`,
      data: editTodo,
      headers: {
        authorization: `Bearer ${accessToken}`,
      },
    };
    const res = await axios(options);
    if (res.status === 200) {
      await getTodos();
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
      url: `${process.env.REACT_APP_API_URL}/todos/${e.target.offsetParent.id}`,
      headers: {
        authorization: `Bearer ${accessToken}`,
      },
    };
    const res = await axios(options);

    if (res.status === 204) {
      // Fetch todos again
      await getTodos();
    } else {
      // display an error message
      <Alert variant="danger">{res}</Alert>;
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
          <Button variant="primary" onClick={toggleModal}>
            Add Todo &#43;
          </Button>
        </Col>
      </Row>

      <Row className="justify-content-md-center">
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
      </Row>
      <Row>
        <CardColumns>
          {todos
            ? todos
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
                        onClick={(e) =>
                          handleEditModal(e.target.offsetParent.id)
                        }
                      >
                        Edit
                      </Button>
                      <Button variant="danger" onClick={handleDelete}>
                        Delete
                      </Button>
                    </Card.Body>
                  </Card>
                ))
            : "No Todos yet"}
        </CardColumns>
      </Row>
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
