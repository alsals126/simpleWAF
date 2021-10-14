// 다시업로드 하기위해 주석 추가함
import React, { useState} from 'react'
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css";
import "../css/logview.css"

const DatePickerOne = (props) => {
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date(null));
    const [text, setText] = useState("기간 설정")
    const onChange = (dates) => {
        const [start, end] = dates
        console.log(start)
        setStartDate(start)
        setEndDate(end)
        setText(()=>{
            const startDay = start.getFullYear().toString() + '.'
                + (start.getMonth()+1).toString()
            return startDate
        })
        if(start!=null && end!=null){ //마지막일 클릭시 datepicker 사라짐
            props.showDatePicker()
        }
    }

    return(
        <DatePicker
            selected={startDate}
            onChange={onChange}
            startDate={startDate}
            endDate={endDate}
            selectsRange
            value={text}
        />
    );
}
function LogView(props) {
    const [openDatePicker, setOpenDatePicker] = useState(false);
    const showDatePicker = () => {
        setOpenDatePicker(!openDatePicker)
    }

    return (
        <div>
            IP <input type="text"/><br/><br/>
            <button
                onClick = {showDatePicker}/>
            <div className="date">
                <DatePickerOne showDatePicker={showDatePicker} />
            </div>
            ---------------------------------------------------------
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