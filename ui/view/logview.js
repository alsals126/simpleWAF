import React, { useState, useEffect } from 'react'
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css";
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
                    ip: item.Ip,
                    date: item.Time,
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
const DatePickerOne = (props) => {
    const onChange1 = (start) => {
        if (start <= props.endDate) {
            props.setStartDate(start)
        }
    }
    const onChange2 = (end) => {
        if (props.startDate <= end) {
            props.setEndDate(end)
        }
    }

    return(
        <>
            <DatePicker
                selectsStart    
                selected={props.startDate}
                onChange={onChange1}
                startDate={props.startDate}
                endDate={props.endDate}
                value={props.startDate.toLocaleDateString('ko-KR')}
            />
            <DatePicker
                selectsEnd
                selected={props.endDate}
                onChange={onChange2}
                startDate={props.startDate}
                endDate={props.endDate}
                value={props.endDate.toLocaleDateString('ko-KR')}
            />
        </>
    );
}

function LogView() {
    const [ip, setIp] = useState("")
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [tableDate, setTableDate] = useState([{
        ip: '',
        date: '',
        policy: ''
    }])
    
    const handleClick = () => DataAccess(ip, startDate, endDate, setTableDate)

    useEffect(()=>{
        DataAccess(ip, startDate, endDate, setTableDate)
    },[]);

    return (
        <div>
            IP <input type="text" value={ip} onChange={({ target: { value } }) => setIp(value)} />
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            기간
            <div className="date">
                <DatePickerOne 
                    startDate={startDate} setStartDate={setStartDate}
                    endDate={endDate} setEndDate={setEndDate}
                />
            </div>
            <button onClick={handleClick}>검색</button>
            <br/><br/>
            <table border="1" style={{textAlign:'center'}}>
                <thead>
                    <tr>
                        <th style={{minWidth:'100px'}}>IP</th>
                        <th style={{minWidth:'200px'}}>시간</th>
                        <th style={{minWidth:'100px'}}>사유</th>
                    </tr>
                </thead>
                <tbody>
                    {tableDate.map(({ ip, date, policy }) => (
                        <tr key={ip + date + policy}>
                            <td>{ip}</td>
                            <td>{date.substring(0,19).replace('T', ' ')}</td>
                            <td>{policy}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
    
export default LogView;