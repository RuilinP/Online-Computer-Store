import { Link, Navigate } from 'react-router-dom';
import { user_context } from "../models/user_model";
import { useContext } from "react";

function EmptyCart(){
	return <div className='empty'>
		<p>Looks like your cart is empty.</p>
		<Link to="/">Back to Shopping!</Link>
	</div>
}



function Cart() {
  const { user, setUser } = useContext(user_context);
	if (!user) {
		//Redirect if not logged in
		return <Navigate replace to="/login"/>
	}

	if(!user.cart || user.cart.items.length == 0){
		return <EmptyCart/>
	}

	let elements = []

	for (const item of user.cart.items){
		//TODO create cart items
	}

	return(
		<div>
			{elements}
		</div>
	)
}
  
  export default Cart;