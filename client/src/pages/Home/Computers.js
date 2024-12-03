import { get_computers} from '../../models/computers_model'
import { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';


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
    let url = ""
    for (const computer of data){
        url = `/computer/:${computer.computer_id}`
        elements.push(<div>
            <NavLink to={url}>{computer.name}</NavLink>
        </div>)
    }

    return elements

}

export default Computers