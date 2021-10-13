import React from 'react'

function IpItem({id, ip}){
    return(
        <li>
            <span>{ip}</span>
            <button>X</button>
        </li>
    );
}

export default IpItem;