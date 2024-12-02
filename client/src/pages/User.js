import { Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { IsLoggedInContext } from '../context';

function User() {
  const isLoggedIn = useContext(IsLoggedInContext);
  if (!isLoggedIn) {
    // redirect if not logged in
    return <Navigate replace to="/login"/>
  }

  return (
    <div>
      <h1>User Placeholder</h1>
    </div>
  );
}
  
  export default User;