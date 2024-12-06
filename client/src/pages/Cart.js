import { Link, Navigate } from 'react-router-dom';
import { User, user_context } from "../models/user_model";
import { useContext } from "react";
import Table from 'react-bootstrap/Table';
import { checkout, clear_cart, get_cart, remove_item } from '../models/cart_model';
import Button from 'react-bootstrap/Button';

import "./Cart/cart.css"

function EmptyCart(){
	return <div className='empty'>
		<p>Looks like your cart is empty.</p>
		<Link to="/">Back to Shopping!</Link>
	</div>
}



function Cart() {
	const { user, setUser } = useContext(user_context);

	const handle_clear = async() => {
		setUser(
			new User(
				user.token,
				user.data,
				await clear_cart(user.token)
			)
		)
	}

	const handle_checkout = async () => {
		let result = await checkout(user.token)

		if (typeof result === 'string' || result instanceof String){
			//error string returned
			alert(result)
		}else{
			alert("Simulated Checkout Successful")
			setUser(
				new User(
					user.token,
					user.data,
					result
				)
			)
		}
	}

	const handle_remove = async (id) => {
		setUser(
			new User(
				user.token,
				user.data,
				await remove_item(user.token, id)
			)
		)
	}

	if (!user) {
		//Redirect if not logged in
		return <Navigate replace to="/login"/>
	}

	if(!user.cart || user.cart.items.length == 0){
		//if cart is undefined or empty
		return <EmptyCart/>
	}

	let elements = []

	for (const item of user.cart.items){
		elements.push(
			<tr>
				<td>{item.name}</td>
				<td>{item.quantity}</td>
				<td>${item.price}</td>
				<td>${item.subtotal.toFixed(2)}</td>
				<Button onClick={() => {handle_remove(item.computer_id)}}>Remove</Button>
			</tr>
		)
	}

	return(
		<div className='cartPage'>
			<Table striped hover className='items'>
				<thead>
					<tr>
						<td>Product Name</td>
						<td>Quantity</td>
						<td>Unit Cost</td>
						<td>Item Subtotal</td>
					</tr>
				</thead>
				<tbody>
					{elements}
				</tbody>
			</Table>

			<Table striped hover className='totals'>
				<tbody>
					<tr>
						<td>Shipping</td>
						<td>${user.cart.shippingFees.toFixed(2)}</td>
					</tr>
					<tr>
						<td>Subtotal</td>
						<td>${user.cart.subtotal.toFixed(2)}</td>
					</tr>
					<tr>
						<td>Tax</td>
						<td>${user.cart.tax.toFixed(2)}</td>
					</tr>
					<tr>
						<td>Total</td>
						<td>${user.cart.total.toFixed(2)}</td>
					</tr>
				</tbody>
			</Table>
			<Button className = "m-4" onClick={handle_clear}>Clear Cart</Button>
			<Button className = "m-4" onClick={handle_checkout}>Checkout</Button>
			
		</div>
	)
}
  
  export default Cart;