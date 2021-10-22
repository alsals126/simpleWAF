import React from 'react'
import axios from "axios";

function IpItem({id, ip, loadIp}){
    return(
        <>
            <td style={{width:'150px'}}>
                <span>{ip}</span>
            </td>
            <td style={{width:'30px'}}>
                <button onClick={()=> //여기서 중괄호 쓰면 안됨
                    deleteIp(id, loadIp)
                }>X</button>
            </td>
        </>
    );
}

const deleteIp = async (id, loadIp) => {
    try{
        // delete 요청 보내기
        const data = await axios.delete('http://127.0.0.1:8080/ip-block/' + id);
        console.log(data)
        if (data.status === 200) loadIp()
    }catch{
        return false
    }
}

export default IpItem;