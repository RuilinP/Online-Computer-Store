import { Navigate } from "react-router";
import { get_user, login, User, user_context } from "../models/user_model";
import { useContext } from "react";
import Form from 'react-bootstrap/Form';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import './login/login.css'
import Button from 'react-bootstrap/Button';
import { Link, NavLink } from 'react-router-dom';



function Login() {
  const { user, setUser } = useContext(user_context);
  if (user) {
    //Redirect if logged in
    return <Navigate replace to="/user"/>
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    event.stopPropagation();
    let email = event.target.email.value;
    let password = event.target.password.value;
    console.log(`Email:${email}, Pass:${password}`)

    let result = await login(email,password);
    if (!result){
      alert("Username or Password Incorrect")
    }else{
      setUser(get_user(result))
    }
  };

  return (
    <div className="loginArea">
      <Form onSubmit={handleSubmit}>
        <FloatingLabel controlId="floatingInput" label="Email address" className="mt-5">
          <Form.Control type="email" placeholder="name@example.com" name="email"/>
        </FloatingLabel>
        <FloatingLabel controlId="floatingPassword" label="Password" className="mt-5">
          <Form.Control type="password" placeholder="Password" name="password" />
        </FloatingLabel>
        <Button type="submit" className="mt-5">Login</Button>
      </Form>
      <NavLink to="/register" className="mt-5" end>Register</NavLink>
    </div>
  );
}
  
  export default Login;