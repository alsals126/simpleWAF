import React from 'react'
import ipblockD from '../image/ipblockDescription.png'
import usercustomD from '../image/usercustomDescription.png'
import logD from '../image/logDescription.png'

// onclick하면 div생성과 삭제
function MainView(){
    return(
        <div>
             <div style={{position:'relative', width: '98%', backgroundColor:'lightgray', height:'15%', marginTop: '2%', padding:'13px', textAlign:'left'}}> 
                <span onClick={()=>{ window.location.href = '/' }} style={{cursor:'pointer'}}>
                    <img src="https://img.icons8.com/ios-glyphs/30/000000/home.png" style={{position: 'absolute', cursor:'pointer'}} alt="Main Page" />
                </span>&emsp;&emsp;&emsp;&emsp;&emsp;
                <span onClick={()=>{ window.location.href = '/ip-block' }} style={{cursor:'pointer'}} >IP차단</span>&emsp;&emsp;&emsp;
                <span onClick={()=>{ window.location.href = '/user-custom' }} style={{cursor:'pointer'}}>사용자정의탐지</span>&emsp;&emsp;&emsp;
                <span onClick={()=>{ window.location.href = '/log' }} style={{cursor:'pointer'}}>로그</span>
            </div>
            
            <div style={{position: 'absolute', width: '90%', left: '5%', top: '14%'}}>
                <h2> 정책 적용 우선순위는 다음과 같습니다. </h2>
                <h4> 1. IP차단 </h4>
                <h4> 2. 사용자 정의 탐지</h4>

                <br/>
                <h2>User Guide</h2>
                <p>IP차단</p> <img src={ipblockD} style={{width:'100%', marginTop:'-16px'}} alt="User Guide - IP차단" /><br/><br/>
                <p>사용자정의탐지</p> <img src={usercustomD} style={{width:'100%', marginTop:'-16px'}} alt="User Guide - 사용자정의탐지" /><br/><br/>
                <p>로그</p> <img src={logD} style={{width:'70%', marginTop:'-16px'}} alt="User Guide - 로그" /><br/><br/>
            </div>
        </div>
    )
}

export default MainView;