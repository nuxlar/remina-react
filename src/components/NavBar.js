import Favicon from "../favicon.ico";
import { Navbar, Nav } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import LoginButton from "../auth/LoginButton";
import LogoutButton from "../auth/LogoutButton";
import SignupButton from "../auth/SignupButton";

function NavBar() {
  const { isAuthenticated } = useAuth0();

  return (
    <>
      <Navbar bg="light" variant="light">
        <Navbar.Brand as={Link} to="/">
          <img
            alt=""
            src={Favicon}
            width="30"
            height="30"
            className="d-inline-block align-top"
          />{" "}
          Project Remina
        </Navbar.Brand>
        {isAuthenticated ? (
          <>
            <LogoutButton />
          </>
        ) : (
          <Nav className="mr-auto">
            <LoginButton />
            <SignupButton />
          </Nav>
        )}
      </Navbar>
    </>
  );
}

export default NavBar;
