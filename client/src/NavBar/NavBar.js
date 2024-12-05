import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Form from 'react-bootstrap/Form';

import './NavBar.css';
import { Link, NavLink } from 'react-router-dom';

import { logout, user_context } from "../models/user_model";
import { useContext } from "react";


function LoginComponent(){
  const { user, setUser } = useContext(user_context);

  let logoutHandler = () =>{
    console.log('click')
    setUser(undefined)
    logout()
  }

  if (user){
    let user_name = user.data.name
    let greeting = `Hello ${user_name}`
    console.log(user)
    return(
      <NavDropdown title={greeting} id="basic-nav-dropdown">
        <NavDropdown.Item>
          <NavLink to="/user">Preferences</NavLink>
        </NavDropdown.Item>
        <NavDropdown.Item onClick={logoutHandler}>
          Logout
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
        <Nav className="d-flex flex-grow-1 bar">
          <Link to="/"><Navbar.Brand >Software Engineer's Computer Superstore</Navbar.Brand></Link>
          
          <Form inline className='flex-grow-1'>
            <div className="search">
              <i className="fa fa-search"></i>
              <input type="text" class="form-control"/>
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