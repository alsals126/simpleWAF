import React from 'react'

// onclick하면 div생성과 삭제
function MainView(){
    function moveToIp(e){
        window.location.href = '/ip-policy'
    }
    function moveToLog(e){
        window.location.href = '/log'
    }

    let option_id = [0, 1];
    let options = [{name: '정책설정'}, {name: 'IP 차단 정책'}];
    let selectedOptionId = 0

    return(
        <div>
            <select defaultValue={selectedOptionId} style={{width: '140px'}} onChange={moveToIp}>
                {option_id.map(id =>
                    id == 0 ? <option key={id} value={id} disabled>{options[id].name}</option> : <option key={id} value={id}>{options[id].name}</option>
                )}
            </select>&nbsp;&nbsp;
            <button style={{width: '140px'}} onClick={moveToLog}>로그</button>&nbsp;&nbsp;
            <button style={{width: '140px'}}>보고서</button>
        </div>
    )
}

export default MainView;