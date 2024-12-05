import { get_computers, get_image_urls_by_computer_id} from '../../models/computers_model'
import { add_item_to_cart } from '../../models/cart_model';
import { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import "./Computers.css"

function Computers(search = undefined){
    
    const [data, setData] = useState()

    const fetchData = async () => {
        try {
          const result = await get_computers(search);
          setData(result);
        } catch (error) {
          console.error('Error fetching data:', error);
        }
    };

    useEffect(() => {
        fetchData();
      }, [search]);

    if (data === undefined){
        return <p>Loading...</p>
    }

    let elements = []
    for (const computer of data){
        let id = computer.computer_id
        let img_url = computer.images && computer.images.length > 0 
        ? `http://computers.ruilin.moe:3001${computer.images[0].image_path}`
        : 'assets/default_image.png'; 
        elements.push(<div className='product_tile'>
            <img src={img_url} alt='Product Image Loading...'/>
            <h2>{computer.name}</h2>
            <p>${computer.price.toFixed(2)} CAD</p>
            <button onClick={()=>{add_item_to_cart(id)}}>
              Add To Cart
              <img src = "assets/shopping_cart_icon.svg"/>
            </button>
        </div>)
    }

    return <div className='display_area'>
      {elements}
    </div>

}

export default Computers