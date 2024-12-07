import { Navigate } from 'react-router-dom';
import { user_context } from "../models/user_model";
import { useContext } from "react";

function User() {
  const { user, setUser } = useContext(user_context);
  if (!user) {
    //Redirect if not logged in
    return <Navigate replace to="/login"/>
  }

  return (
    <div>
      <h1>User Placeholder</h1>
    </div>
  );
}
  
  export default User;