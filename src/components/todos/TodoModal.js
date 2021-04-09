import React from "react";
import { Col, Form, Button, Modal } from "react-bootstrap";

function TodoModal(props) {
  return (
    <>
      {props.todo ? (
        <Modal
          show={props.show}
          onHide={props.onHide}
          size="lg"
          aria-labelledby="contained-modal-title-vcenter"
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title-vcenter">
              Edit Todo
            </Modal.Title>
          </Modal.Header>
          <Modal.Body id={props.todo.id}>
            <Form onSubmit={props.handleSubmitE}>
              <Form.Row>
                <Form.Control
                  type="text"
                  placeholder="Description"
                  name="description"
                  defaultValue={props.todo.description}
                />
              </Form.Row>
              <Form.Row>
                <Col>
                  <Form.Control
                    type="date"
                    name="dueDate"
                    defaultValue={props.todo.dueDate}
                  />
                  <Form.Control
                    type="time"
                    name="dueTime"
                    defaultValue={props.todo.dueTime}
                  />
                </Col>
                <Col>
                  <Form.Check
                    type="checkbox"
                    label="completed"
                    name="completed"
                    defaultChecked={props.todo.completed}
                  />
                </Col>
              </Form.Row>
              <Button variant="primary" type="submit">
                Submit
              </Button>
            </Form>
          </Modal.Body>
        </Modal>
      ) : (
        <Modal
          show={props.show}
          onHide={props.onHide}
          size="lg"
          aria-labelledby="contained-modal-title-vcenter"
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title-vcenter">
              Add Todo
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={props.handleSubmit}>
              <Form.Row>
                <Form.Control
                  type="text"
                  placeholder="Description"
                  name="description"
                />
              </Form.Row>
              <Form.Row>
                <Col>
                  <Form.Control type="date" name="dueDate" />
                  <Form.Control type="time" name="dueTime" />
                </Col>
                <Col>
                  <Form.Check
                    type="checkbox"
                    label="completed"
                    name="completed"
                  />
                </Col>
              </Form.Row>
              <Button variant="primary" type="submit">
                Submit
              </Button>
            </Form>
          </Modal.Body>
        </Modal>
      )}
    </>
  );
}
export default TodoModal;
