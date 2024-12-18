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
    return <Navigate replace to="/"/>
  }

  
  


  const handleSubmit = async (event) => {
    event.preventDefault();
    event.stopPropagation();
    let email = event.target.email.value;
    let password = event.target.password.value;
    console.log(`Email:${email}, Pass:${password}`)

    const token = await login(email, password);
    if (!token) {
        alert("Username or Password Incorrect");
        return;
    }

    localStorage.setItem("authToken", token);

    try {
        const response = await fetch("https://computers.ruilin.moe/api/users/me", {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (response.ok) {
            const userData = await response.json();
            setUser(userData.user);

            if (userData.user.role === "buyer") {
                const cartCheckResponse = await fetch("https://computers.ruilin.moe/api/carts/view", {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (cartCheckResponse.ok) {
                    console.log("Cart already exists for user.");
                } else if (cartCheckResponse.status === 404) {
                    const cartResponse = await fetch("https://computers.ruilin.moe/api/carts/create", {
                        method: "POST",
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });

                    if (cartResponse.ok) {
                        console.log("Cart created successfully.");
                    } else {
                        console.error("Failed to create cart:", cartResponse.statusText);
                    }
                } else {
                    console.error("Failed to check cart:", cartCheckResponse.statusText);
                }
            }

            alert("Login successful!");
        } else {
            console.error("Failed to fetch user info:", response.statusText);
        }
    } catch (error) {
        console.error("Error fetching user info:", error);
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