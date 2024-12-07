import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Form from 'react-bootstrap/Form';


import './NavBar.css';
import { Link, NavLink } from 'react-router-dom';


import { logout, user_context } from "../models/user_model";
import { useContext } from "react";

import { useRef } from 'react';
import { useNavigate } from "react-router-dom";

function LoginComponent() {
  const { user, setUser } = useContext(user_context);
  console.log("User context in NavBar:", user);

  let logoutHandler = () => {
    console.log('click')
    setUser(undefined)
    logout()
  }

  if (user) {
    const userName = user?.name || "Guest";
    let greeting = `Hello ${userName}`
    console.log(user)
    return (
      <NavDropdown title={greeting} id="basic-nav-dropdown">
        <NavDropdown.Item>
          <NavLink to="/user">Preferences</NavLink>
        </NavDropdown.Item>
        {user?.role === "admin" && (
          <>
            <NavDropdown.Item>
              <NavLink to="/products">Manage Products</NavLink>
            </NavDropdown.Item>
            <NavDropdown.Item>
              <NavLink to="/orders">Manage Orders</NavLink> {/* Add this */}
            </NavDropdown.Item>
          </>

        )}

        <NavDropdown.Item onClick={logoutHandler}>
          Logout
        </NavDropdown.Item>
      </NavDropdown>
    );
  } else {
    return (
      <NavLink to="/login" end>
        Login or Register
      </NavLink>
    )
  }
}

function CartComponent() {
  const { user, setUser } = useContext(user_context);
  if (user) {
    return <Link to="/cart">Go To Cart</Link>
  } else {
    return undefined
  }
}


function NavBar() {
  const inputRef = useRef(null);
  const navigate = useNavigate();

  const handleSearch = () => {
    const search = inputRef.current.value;
    navigate(`/search/${search}`);
  };

  return (
    <Navbar expand="lg" className="bg-body-tertiary justify-content-between">
      <Container>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="d-flex flex-grow-1 bar">
            <Link to="/">
              <Navbar.Brand>Software Engineer's Computer Superstore</Navbar.Brand>
            </Link>
            <Form inline className="flex-grow-1">
              <div className="search">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search"
                  ref={inputRef}
                />
                <button className="btn btn-primary" onClick={handleSearch}>
                  Search
                </button>
              </div>
            </Form>
            <LoginComponent />
            <CartComponent />
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}


export default NavBar;