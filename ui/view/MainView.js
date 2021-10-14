import React from 'react'

// onclick하면 div생성과 삭제
function MainView(){
    function moveToIp(e){
        window.location.href = '/ip-policy'
    }
    function moveToLog(e){
        window.location.href = '/log'
    }
    return(
        <div>
            <select style={{width: '140px'}} onChange={moveToIp}>
                <option value="" selected disabled hidden>정책설정</option>
                <option value="ip">IP 차단 정책</option>
            </select>&nbsp;&nbsp;
            <button style={{width: '140px'}} onClick={moveToLog}>로그</button>&nbsp;&nbsp;
            <button style={{width: '140px'}}>보고서</button>
        </div>
    )
}

export default MainView;