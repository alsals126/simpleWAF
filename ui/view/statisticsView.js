import React, { useState, useEffect } from 'react'
import axios from "axios";
import moment from 'moment';
import "../css/logview.css"

let endpoint = "http://127.0.0.1:8080";

function DataAccess(ip, startDate, endDate, setTableDate) {
    var query = ""
    if(ip!=="" || startDate.toLocaleDateString()!==new Date().toLocaleDateString || endDate.toLocaleDateString()!==new Date().toLocaleDateString){
        query += "?"

        if(ip!=="") {
            query += "ip="+ip
        }
        if(startDate.toLocaleDateString()!==new Date().toLocaleDateString) {
            if(ip!=="") query += "&"
            query += "startDate="+moment(startDate).format('YYYY-MM-DD')
        }
        if(endDate.toLocaleDateString()!==new Date().toLocaleDateString) {
            if(ip!=="" || startDate.toLocaleDateString()!==new Date().toLocaleDateString) 
                query += "&"
            query += "endDate="+ 
                `${endDate.getFullYear()}-${
                    (endDate.getMonth() + 1)>=10 ? (endDate.getMonth() + 1) : '0'+(endDate.getMonth() + 1)
                }-${
                    (endDate.getDate() + 1)>=10 ? (endDate.getDate() + 1) : '0'+(endDate.getDate() + 1)
                }`
        }    
    }

    axios.get(endpoint+"/log"+query)
    .then((res) => {
        // response 
        var tem = []

        if(res.data != null){
            res.data.forEach((item) => {
                var data = { 
                    id: item.Id,
                    ip: item.Ip,
                    date: item.Date,
                    policy: item.Policy
                };
                tem = tem.concat(data)
            })  
        }
        setTableDate(tem)
    }).catch((error) => {
        alert('에러발생\n관리자에게 문의해주세요')
        console.log(error)
    })
}

function statisticsView() {
    const [ip, setIp] = useState("")
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [tableDate, setTableDate] = useState([{
        id: 0,
        ip: '',
        date: '',
        policy: ''
    }])
    
    const handleClick = () => DataAccess(ip, startDate, endDate, setTableDate)

    useEffect(()=>{
        DataAccess(ip, startDate, endDate, setTableDate)
    },[]);

    return (
        <div style={{position: 'absolute', left: '2%', top: '3%'}}>
            통계
            <div style={{border:}}></div>
            <br/><br/>
            <table style={{textAlign:'center',  borderTop: '1px solid #444444',  borderCollapse: 'collapse'}}>
                <thead>
                    <tr>
                        <th style={{minWidth:'100px', borderBottom: '1px solid #444444'}}>IP</th>
                        <th style={{minWidth:'200px', borderBottom: '1px solid #444444'}}>시간</th>
                        <th style={{minWidth:'100px', borderBottom: '1px solid #444444'}}>사유</th>
                    </tr>
                </thead>
                <tbody>
                    {tableDate.map(({ id, ip, date, policy }) => (
                        <tr key={id + ip + date + policy}>
                            <td style={{borderBottom: '1px dotted #444444', padding: '8px'}}>{ip}</td>
                            <td style={{textAlign:'left', borderBottom: '1px dotted #444444', padding: '8px'}}>{date.replace('T', ' ').replace('Z', '')}</td>
                            <td style={{borderBottom: '1px dotted #444444', padding: '8px'}}>{policy}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
    
export default statisticsView;