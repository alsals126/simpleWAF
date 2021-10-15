import React, { useState} from 'react'
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";
import "../css/logview.css"

let endpoint = "http://127.0.0.1:8080";

function dataAccess(ip, startDate, endDate) {
    const param = new URLSearchParams();
    console.log(ip)

    if(ip!="") {
        param.append('ip', ip)
    }
    if(startDate!="날짜선택") {
        param.append('startDate', startDate)
    }
    if(endDate!="날짜선택") {
        param.append('endDate', endDate)
    }    

    console.log(param)
    var tem = []
        axios.get(endpoint+"/log", param)
        .then((res) => {
            // response  
            // if(res.data != null){
            //     res.data.forEach((item) => {
            //         var ipInfo = { id: item.Id, ip: item.Ip };
            //         tem = tem.concat(ipInfo)
            //     })  
            //     this.setState({
            //         loading: true,
            //         Iplist: tem
            //     })
            // }
        }).catch((error) => {
            alert('에러발생\n관리자에게 문의해주세요')
            console.log(error)
            // this.setState({
            //     loading: false
            // })
        })
}
const DatePickerOne = (props) => {
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
  
    const onChange1 = (start) => {
        if (start <= endDate) {
            setStartDate(start)
            props.setStartText(
                start.getFullYear().toString() + '.'
                    + (start.getMonth()+1).toString() + '.'
                    + start.getDate().toString()
            )
        }
    }
    const onChange2 = (end) => {
        if (startDate <= end) {
            setEndDate(end)
            props.setEndText(
                end.getFullYear().toString() + '.'
                    + (end.getMonth()+1).toString() + '.'
                    + end.getDate().toString()
            )
        }
    }

    return(
        <>
            <DatePicker
                selectsStart    
                selected={startDate}
                onChange={onChange1}
                startDate={startDate}
                endDate={endDate}
                value={props.startText}
            />
            <DatePicker
                selectsEnd
                selected={endDate}
                onChange={onChange2}
                startDate={startDate}
                endDate={endDate}
                value={props.endText}
            />
        </>
    );
}

function LogView() {
    const [ip, setIp] = useState("")
    const [startText, setStartText] = useState("날짜선택")
    const [endText, setEndText] = useState("날짜선택")

    const onChangeIp = (e) =>{
        setIp(e.target.value);
        console.log(ip);
        dataAccess(ip, startText, endText);
    }

    return (
        <div>
            IP <input type="text" value={ip} onChange={onChangeIp
            }/> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            기간
            <div className="date">
                <DatePickerOne 
                    startText={startText} setStartText={setStartText}
                    endText={endText} setEndText={setEndText}
                />
            </div>
            <br/><br/>
            <table border="1">
                <th>IP</th>
                <th>시간</th>
                <th>사유</th>
                <tr>
                    <td>10.101.101.10</td>
                    <td>202.09.45 21:50:54</td>
                    <td>Ip</td>
                </tr>
            </table>
        </div>
    );
}
    
export default LogView;