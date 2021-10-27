import React from 'react'
import axios from "axios";

function IpItem({id, ip, loadIp}){
    return(
        <>
            <td style={{width:'150px', borderBottom: '1px dotted #444444', padding: '10px'}}>
                <span style={{margin:'20px'}}>{ip}</span>
            </td>
            <td style={{borderBottom: '1px dotted #444444', padding: '10px', textAlign: 'right'}}>
                <button onClick={()=> //여기서 중괄호 쓰면 안됨
                    deleteIp(id, loadIp)
                } style={{marginRight:'20px', cursor: 'pointer'}}>X</button>
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