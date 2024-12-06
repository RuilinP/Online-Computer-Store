import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Form from 'react-bootstrap/Form';
import { useContext } from 'react';
import { IsLoggedInContext } from '../context';

import './NavBar.css';
import { Link, NavLink } from 'react-router-dom';

function LoginComponent(){
  const isLoggedIn = useContext(IsLoggedInContext);
  if (isLoggedIn){
    return(
      <NavDropdown title="Login Placeholder" id="basic-nav-dropdown">
        <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
        <NavDropdown.Item href="#action/3.2">
          Another action
        </NavDropdown.Item>
        <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
        <NavDropdown.Divider />
        <NavDropdown.Item href="#action/3.4">
          Separated link
        </NavDropdown.Item>
      </NavDropdown>
    )
  }else{
    return(
      <NavLink to="/login" end>
        Login or Register
      </NavLink>
    )
  }
}

function NavBar() {

  

  return (
    <Navbar expand="lg" className="bg-body-tertiary justify-content-betweens">
    <Container>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav flex-grow-1">
        <Nav className="d-flex flex-grow-1">
          <Navbar.Brand href="#home">Name Placeholder</Navbar.Brand>
          
          <Form inline className='flex-grow-1'>
            <div className="search">
              <i className="fa fa-search"></i>
              <input type="text" class="form-control" placeholder="Have a question? Ask Now"/>
              <button className="btn btn-primary">Search</button>
            </div>
          </Form>
          <LoginComponent/>
          <NavDropdown title="Cart Placeholder" id="basic-nav-dropdown">
            <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
            <NavDropdown.Item href="#action/3.2">
              Another action
            </NavDropdown.Item>
            <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
            <NavDropdown.Divider />
            <NavDropdown.Item href="#action/3.4">
              Separated link
            </NavDropdown.Item>
          </NavDropdown>
        </Nav>
      </Navbar.Collapse>
    </Container>
  </Navbar>
  );
}

export default NavBar;