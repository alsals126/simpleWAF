import React, { useState, useEffect } from 'react'
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";
import moment from 'moment';
import "../css/logview.css"

let endpoint = "http://127.0.0.1:8080";

function DataAccess(ip, startDate, endDate, setTableData, limit, setTable) {
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
        setTableData(tem)
        setTable(tem.filter(function(a, index, b){
            return index<limit;
        }))
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
    const [tableData, setTableData] = useState([{
        id: 0,
        ip: '',
        date: '',
        policy: ''
    }])
    const [limit, setLimit] = useState(15)
    const [table, setTable] = useState([{
        id: 0,
        ip: '',
        date: '',
        policy: ''
    }])
    
    const handleClick = () => 
        DataAccess(ip, startDate, endDate, setTableData, limit, setTable)
  
    const moveToIp = ()=>{
        window.location.href = '/'
    }
    const addHandleClick = () =>{
        setLimit(limit+15) // limit이 바뀌면
    }

    useEffect(()=>{
        DataAccess(ip, startDate, endDate, setTableData, limit, setTable)
    },[]);
    useEffect(()=>{ // 얘가 실행
        setTable(tableData.filter(function(a, index, b){ //그럼 얘도 자동적으로 실행
            return index<limit;
        }))
    }, [limit])

    return (
        <>
            <img src="https://img.icons8.com/ios-glyphs/30/000000/home.png" style={{position: 'absolute', right:'2%', top: '2%', cursor:'pointer'}} onClick={moveToIp} alt="main" />
            <div style={{position: 'absolute', left: '2%', top: '3%'}}>
                IP <input type="text" value={ip} onChange={({ target: { value } }) => setIp(value)} />
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                기간
                <div className="date" style={{marginBottom:'10px'}}>
                    <DatePickerOne 
                        startDate={startDate} setStartDate={setStartDate}
                        endDate={endDate} setEndDate={setEndDate}
                    />
                </div>
                <button onClick={handleClick} style={{width:'130px', marginLeft: '410px'}}>검색</button>
                <br/><br/>
                <table style={{textAlign:'center',  borderTop: '1px solid #444444',  borderCollapse: 'collapse'}}>
                    <thead>
                        <tr>
                            <th style={{minWidth:'150px', borderBottom: '1px solid #444444'}}>IP</th>
                            <th style={{minWidth:'250px', borderBottom: '1px solid #444444'}}>시간</th>
                            <th style={{minWidth:'150px', borderBottom: '1px solid #444444'}}>사유</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            table.map(({ id, ip, date, policy }) => (
                                <tr key={id + ip + date + policy}>
                                    <td style={{borderBottom: '1px dotted #444444', padding: '8px'}}>{ip}</td>
                                    <td style={{textAlign:'left', borderBottom: '1px dotted #444444', padding: '8px'}}>{date.replace('T', ' ').replace('Z', '')}</td>
                                    <td style={{borderBottom: '1px dotted #444444', padding: '8px'}}>{policy}</td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
                <br/>
                {limit<=tableData.length ? <button onClick={addHandleClick}>더보기</button> : null}
                <br/>
            </div>
        </>
    );
}
    
export default LogView;