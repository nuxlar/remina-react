import React, { useState, useEffect } from "react";
import TodoModal from "./TodoModal";
import { useAuth0 } from "@auth0/auth0-react";
import { BsPlus, BsTrash, BsPencil } from "react-icons/bs";
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

function TodoPage(props) {
  const { user, isAuthenticated, getAccessTokenSilently } = useAuth0();
  const [todos, setTodos] = useState(null);
  const [modalShow, setModalShow] = useState(false);
  const [editTodo, setEditTodo] = useState(null);
  const [filter, setFilter] = useState("Uncompleted");

  const getTodos = async () => {
    try {
      const accessToken = await getAccessTokenSilently({
        audience: `https://project-remina/`,
      });
      const options = {
        method: "GET",
        url: `${process.env.REACT_APP_API_URL}/todos?username=${user.sub}`,
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
  }, [user]);

  if (!isAuthenticated)
    return (
      <Container fluid className="spinnerContainer">
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
    formDataObj.user = props.apiUser.id;
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
      if (res.data.completed === true) {
        props.getApiUser();
      }
      await getTodos();
      e.target.reset();
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
    formDataObj.user = props.apiUser.id;
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
      e.target.reset();
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
      props.getApiUser();
      await getTodos();
    } else {
      // display an error message
      <Alert variant="danger">{res}</Alert>;
    }
  };

  const handleDelete = async (e) => {
    let todoId;

    if (e.target.type) {
      todoId = e.target.parentElement.offsetParent.id;
    } else {
      todoId = e.target.parentElement.parentElement.offsetParent.id;
    }

    const accessToken = await getAccessTokenSilently({
      audience: `https://project-remina/`,
    });
    const options = {
      method: "DELETE",
      url: `${process.env.REACT_APP_API_URL}/todos/${todoId}`,
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

  const handleEditModal = (e) => {
    let todoId;

    if (e.target.type) {
      todoId = e.target.parentElement.offsetParent.id;
    } else {
      todoId = e.target.parentElement.parentElement.offsetParent.id;
    }

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
        <Col xs={12}>
          <h2>To-dos</h2>
        </Col>
        <Col xs={5} className="justify-content-md-center">
          <p className="mb-2 text-muted">
            Add to-dos and mark them as completed.
          </p>
        </Col>
        <Col xs={1} className="justify-content-md-center">
          <Button variant="primary" size="sm" onClick={toggleModal}>
            <BsPlus size={25} />
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
                        disabled={filter === "Completed" ? true : null}
                      />
                      <Card.Link>
                        {" "}
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={handleEditModal}
                        >
                          <BsPencil size={20} />
                        </Button>
                      </Card.Link>
                      <Card.Link>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={handleDelete}
                        >
                          <BsTrash size={20} />
                        </Button>
                      </Card.Link>
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
