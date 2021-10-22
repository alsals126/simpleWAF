import React, { useState, useEffect } from 'react'

function LogView() {
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