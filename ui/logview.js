import React, { useState } from 'react'
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css";
import ReactDOM from 'react-dom'

function FuncComponent(props) {
    const [startDate, setStartDate] = useState(new Date("2021/09/06"));
    const [endDate, setEndDate] = useState(new Date());
    return (
        <div>
            IP <input type="text"/><br/><br/>
            기간
            <DatePicker
                selected={startDate}
                onChange={(date) => setStartDate(date)}
                selectsStart
                startDate={startDate}
                endDate={endDate}
            />
            <DatePicker
                selected={endDate}
                onChange={(date) => setEndDate(date)}
                selectsEnd
                startDate={startDate}
                endDate={endDate}
                minDate={startDate}
            />
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
const rootElement = document.getElementById("root")
ReactDOM.render(<FuncComponent />, rootElement)