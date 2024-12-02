import { Navigate } from "react-router";
import { useContext } from 'react';
import { IsLoggedInContext } from '../context';

function Login() {
  const isLoggedIn = useContext(IsLoggedInContext);
  if (isLoggedIn) {
    //Redirect if logged in
    return <Navigate replace to="/user"/>
  }

  return (
    <div>
      <h1>Login Placeholder</h1>
    </div>
  );
}
  
  export default Login;