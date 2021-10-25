import React, {useState, useEffect} from 'react'
import axios from "axios";

let endpoint = "http://127.0.0.1:8080";

const insertUserCustom = async (policyName, setPolicyName, options, optionsIndex, inputValue, setInputValue, setTableDate) => {
    if(optionsIndex === 0) return
    if(policyName === "" || inputValue === "") {
        alert("모두 다 입력해주세요")
        return
    }

    // post 요청 보내기
    var bodyFormData = new FormData();
    bodyFormData.append('field', options[optionsIndex].name);
    bodyFormData.append('rule', inputValue)
    bodyFormData.append('policy', "사용자정의탐지("+ policyName +")")

    await axios({
        method:"post",
        url:endpoint+"/user-custom",
        data: bodyFormData
    })
    .then(function (response) {
        // response    
        getUserCustom(setTableDate)
    }).catch((error) => {
        alert('에러발생\n관리자에게 문의해주세요')
        console.log(error)
    }).then(() => {
        // 항상 실행
        setInputValue('')
        setPolicyName('')
    });
}
const getUserCustom = (setTableDate)=>{
    axios.get(endpoint+"/user-custom")
    .then((res) => {
        // response 
        var tem = []

        if(res.data != null){
            res.data.forEach((item) => {
                var data = { 
                    id: item.Id,
                    policy: item.Policy,
                    field: item.Field,
                    rule: item.Rule
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
const deleteIp = async (id, setTableDate) => {
    try{
        // delete 요청 보내기
        const data = await axios.delete(endpoint+"/user-custom/" + id);
        if (data.status === 200) getUserCustom(setTableDate)
    }catch{
        return false
    }
}

function UserCustom(){
    let option_id = [0,1,2,3,4,5];
    let options = [{name: '필드를 선택하세요'}, {name: 'Cookie'}, {name: 'Host'}, {name: 'URI'}, {name: 'User-Agent'}, {name: 'Method'}];
    let selectedOptionId = 0
    const [optionsIndex, setOptionsIndex] = useState(0)
    const [policyName, setPolicyName] = useState("")
    const [inputValue, setInputValue] = useState("")
    const [tableDate, setTableDate] = useState([{
        id: '',
        policy: '',
        field: '',
        rule: ''
    }])

    useEffect(()=>{
        getUserCustom(setTableDate)
    },[]);

    const onKeyPress = (e) => {
        if(e.key === 'Enter')
            insertUserCustom(policyName, setPolicyName, options, optionsIndex, inputValue, setInputValue, setTableDate)
    }

    return(
        <div style={{position: 'absolute', left: '2%', top: '3%'}}>
            <div style={{float:'left'}}>
                정책이름<br/>
                <input type="text" placeholder="정책이름" onChange={({ target: { value } }) => setPolicyName(value)} value={policyName} onKeyPress={onKeyPress}/>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            </div>
            <div style={{float:'left'}}>
                필드<br/>
                <select defaultValue={selectedOptionId} onChange={(e) => {setOptionsIndex(e.target.value); setInputValue("")}}>
                    {option_id.map(id =>
                        id === 0 ? <option key={id} value={id} disabled>{options[id].name}</option> : <option key={id} value={id}>{options[id].name}</option>
                    )}
                </select>&nbsp;
            </div>
            <div style={{float:'left'}}>
                <span style={{color:'white'}}>줄맞추기</span><br/>
                {
                    optionsIndex===0 ? 
                    <input type="text" placeholder={options[optionsIndex].name} onChange={({ target: { value } }) => setInputValue(value)} value={inputValue} onKeyPress={onKeyPress} readOnly/> : 
                    <input type="text" placeholder={options[optionsIndex].name} onChange={({ target: { value } }) => setInputValue(value)} value={inputValue} onKeyPress={onKeyPress} />
                }     
                <button onClick={() => insertUserCustom(policyName, setPolicyName, options, optionsIndex, inputValue, setInputValue, setTableDate)}>Add</button>
            </div>
            <br/><br/><br/><br/>
            * 탐지순서는 필드순<span style={{fontSize: '13px'}}>(Cookie, Host, URI, User-Agent, Method)</span>으로 진행됩니다.
            <table style={{textAlign:'center', borderTop: '1px solid #444444',  borderCollapse: 'collapse'}}>
                <thead>
                    <tr>
                        <th style={{minWidth:'150px', borderBottom: '1px solid #444444'}}>정책명</th>
                        <th style={{minWidth:'100px', borderBottom: '1px solid #444444'}}>필드</th>
                        <th style={{minWidth:'200px', borderBottom: '1px solid #444444'}}>규칙</th>
                        <th style={{minWidth:'35px', borderBottom: '1px solid #444444'}}></th>
                    </tr>
                </thead>
                <tbody>
                    {tableDate.map(({id, policy, field, rule}) => (
                        <tr key={id + policy + field + rule}>
                            <td style={{borderBottom: '1px dotted #444444', padding: '8px'}}>{policy}</td>
                            <td style={{borderBottom: '1px dotted #444444', padding: '8px'}}>{field}</td>
                            <td style={{borderBottom: '1px dotted #444444', padding: '8px'}}>{rule}</td>
                            <td style={{borderBottom: '1px dotted #444444', padding: '8px'}}>
                                <button onClick={()=> deleteIp(id, setTableDate) }>X</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default UserCustom;