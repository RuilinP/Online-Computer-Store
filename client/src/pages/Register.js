import { Navigate } from 'react-router-dom';
import { user_context } from "../models/user_model";
import { useContext } from "react";

function Register() {
  const { user, setUser } = useContext(user_context);
  if (user) {
    //Redirect if logged in
    return <Navigate replace to="/user"/>
  }

  return (
    <div>
      <h1>Register Placeholder</h1>
    </div>
  );
}
  
  export default Register;