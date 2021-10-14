import React from 'react'
import axios from "axios";

function IpItem({id, ip, loadIp}){
    return(
        <li>
            <span>{ip}</span>
            <button onClick={()=> //여기서 중괄호 쓰면 안됨
                deleteIp(id) ? loadIp() : null
            }>X</button>
        </li>
    );
}

const deleteIp = (id) => {
    var result = true

    // delete 요청 보내기
    axios.delete('http://127.0.0.1:8080/ip-proxy/' + id)
    .then(function (response) {
        // response    
    }).catch((error) => {
        result = false

        alert('에러발생\n관리자에게 문의해주세요')
        console.log(error)
    });
    return result
}

export default IpItem;