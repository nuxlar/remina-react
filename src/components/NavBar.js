import logo from "../logo.svg";
import { Navbar, Nav } from "react-bootstrap";
import { Link } from "react-router-dom";

function NavBar() {
  return (
    <>
      <Navbar bg="light" variant="light">
        <Navbar.Brand as={Link} to="/">
          <img
            alt=""
            src={logo}
            width="30"
            height="30"
            className="d-inline-block align-top"
          />{" "}
          Project Remina
        </Navbar.Brand>
        <Nav className="mr-auto">
          <Nav.Link as={Link} to="/todos">
            Todos
          </Nav.Link>
          <Nav.Link as={Link} to="/habits">
            Habits
          </Nav.Link>
          <Nav.Link as={Link} to="/goals">
            Goals
          </Nav.Link>
        </Nav>
      </Navbar>
    </>
  );
}

export default NavBar;
