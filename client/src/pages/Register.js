import { Navigate } from 'react-router-dom';
import { register, user_context } from "../models/user_model";
import { useContext } from "react";
import Form from 'react-bootstrap/Form';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import './login/login.css'
import Button from 'react-bootstrap/Button';
import { Link, NavLink } from 'react-router-dom';

import './Register/Register.css'

import { useNavigate } from "react-router-dom";


function Register() {
  const { user, setUser } = useContext(user_context);
  let navigate = useNavigate();
  if (user) {
    //Redirect if logged in
    return <Navigate replace to="/user"/>
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    event.stopPropagation();
    let email = event.target.email.value;
    let password = event.target.password.value;
    let name = event.target.name.value;
    let phone = event.target.phone.value;
    let address = event.target.address.value;
    console.log(`Email:${email}, Pass:${password}, Name:${name}, Phone:${phone}, Address:${address}`)

    let result = await register(name, phone, email, address, password, "buyer");
    
    if (result === true) {
        alert("Registration Successful \n Returning to Login");
        navigate("/login");
    } else {
        alert(result); 
    }
  };

  return (
    <div className="registerArea">
      <Form onSubmit={handleSubmit}>
        <FloatingLabel controlId="floatingInput" label="Your Name" className="mt-5">
          <Form.Control type="text" placeholder="" name="name"/>
        </FloatingLabel>
        <FloatingLabel controlId="floatingInput" label="Email address" className="mt-5">
          <Form.Control type="email" placeholder="name@example.com" name="email"/>
        </FloatingLabel>
        <FloatingLabel controlId="floatingInput" label="Phone Number" className="mt-5">
          <Form.Control type="text" placeholder="123 456 7890" name="phone"/>
        </FloatingLabel>
        <FloatingLabel controlId="floatingInput" label="Shipping address" className="mt-5">
          <Form.Control as="textarea" name="address"/>
        </FloatingLabel>
        <FloatingLabel controlId="floatingPassword" label="Password" className="mt-5">
          <Form.Control type="password" placeholder="Password" name="password" />
        </FloatingLabel>
        <Button type="submit" className="mt-5">Register</Button>
      </Form>
    </div>
  );
}
  
  export default Register;