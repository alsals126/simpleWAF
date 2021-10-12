import React from 'react'
import ReactDOM from 'react-dom'

// onclick하면 div생성과 삭제
function MainView(){
    return(
        <div>
            <select style={{width: '140px'}}>
                <option value="" selected disabled hidden>정책설정</option>
                <option value="ip">IP 차단 정책</option>
            </select>&nbsp;&nbsp;
            <button style={{width: '140px'}}>로그</button>&nbsp;&nbsp;
            <button style={{width: '140px'}}>보고서</button>
        </div>
    )
}
ReactDOM.render(<MainView />, document.getElementById("root"))