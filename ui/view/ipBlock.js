import React, { Component } from 'react'
import axios from "axios";
import IpItem from './iPItem'

let endpoint = "http://127.0.0.1:8080";

class IPList extends Component {
    render() {
        const { Ipitem } = this.props;
        return (
            <table style={{width: '100%', borderTop: '1px solid #444444',  borderCollapse: 'collapse' }}>
                <thead>
                    <tr>
                        <th colSpan='2' style={{borderBottom: '1px solid #444444', padding: '3px'}}>IP</th>
                    </tr>
                </thead>
                <tbody>
                    {Ipitem.map((itemdata) => {
                        return(
                            <tr key={itemdata.id + itemdata.ip}>
                                <IpItem
                                    id={itemdata.id}
                                    ip={itemdata.ip}
                                    loadIp={this.props.loadIp}
                                />
                            </tr>
                        )
                    })}
                </tbody>
            </table>
        );
      }
}
class IPAdder extends Component {
    constructor(props) {
        super(props)
        this.state = {
            ip: ''
        }
    }

    handleChange = (e) => {
        this.setState({ ip: e.target.value })
    }
    onKeyPress = (e) => {
        if(e.key === 'Enter')
            this.onClick()
    }
    onClick = () => {
        const regex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/
        if(regex.test(this.state.ip)){
            this.insertIp().then(
                (value) => value ? this.props.loadIp() : null
            )
        }
        else
            alert('잘못된 형식의 IP주소입니다.')
    }
    insertIp = async () => {
        var result = true

        // post 요청 보내기
        var bodyFormData = new FormData();
        bodyFormData.append('ip', this.state.ip);
        bodyFormData.append('policy', "ip차단")

        axios({
            method:"post",
            url:endpoint+"/ip-block",
            data: bodyFormData
        })
        .then(function (response) {
            // response    
        }).catch((error) => {
            result = false

            alert('에러발생\n관리자에게 문의해주세요')
            console.log(error)
        }).then(() => {
            // 항상 실행
            this.setState({ ip: '' }) //화살표 함수에서 작동됨.. 왜지?
        });
        return result
    }

    render() {
        return (
            <div>
                <input type='text' 
                    value={this.state.ip} 
                    onChange={this.handleChange} 
                    onKeyPress={this.onKeyPress} 
                    placeholder="IP주소를 입력하세요"
                    style={{height: '20px', marginRight:'1px'}}
                />
                <button onClick={this.onClick} style={{height: '27px', cursor: 'pointer'}}>&nbsp;Add&nbsp;</button>
            </div>
        )
    }
}
class IPPolicy extends Component {
    constructor(props){
        super(props)
        this.state = {
            loading: false,
            Iplist: []
        };
    }
    moveToIp = ()=>{
        window.location.href = '/'
    }

    // 처음 로드될 때 모든 데이터 부르기
    loadIp = () =>{
        var tem = []
        axios({
            method:"get",
            url:endpoint+"/ip-block"
        })
        .then((res) => {
            // response  
            if(res.data != null){
                res.data.forEach((item) => {
                    var ipInfo = { id: item.Id, ip: item.Ip };
                    tem = tem.concat(ipInfo)
                })  
            }

            this.setState({
                loading: true,
                Iplist: tem
            })
        }).catch((error) => {
            alert('에러발생\n관리자에게 문의해주세요')
            console.log(error)
            this.setState({
                loading: false
            })
        })
    }

    componentDidMount(){
        this.loadIp();
    }

    render() {
        const {Iplist} = this.state;
        return (
            <> <div style={{ position: 'relative', width: '98%', backgroundColor: 'lightgray', height: '15%', marginTop: '2%', padding: '13px', textAlign: 'left' }}>
                <span onClick={() => { window.location.href = '/' }} style={{ cursor: 'pointer' }}>
                    <img src="https://img.icons8.com/ios-glyphs/30/000000/home.png" style={{ position: 'absolute', cursor: 'pointer' }} alt="Main Page" />
                </span>&emsp;&emsp;&emsp;&emsp;&emsp;
                <span onClick={() => { window.location.href = '/ip-block' }} style={{ cursor: 'pointer', fontWeight:'bold' }} >IP차단</span>&emsp;&emsp;&emsp;
                <span onClick={() => { window.location.href = '/user-custom' }} style={{ cursor: 'pointer' }}>사용자정의탐지</span>&emsp;&emsp;&emsp;
                <span onClick={() => { window.location.href = '/log' }} style={{ cursor: 'pointer' }}>로그</span>

            </div>

                <div style={{position: 'absolute', width: '70%', left: '13%', top: '14%'}}>
                    <IPAdder
                        loadIp={this.loadIp} /><br/>
                    <IPList Ipitem={Iplist} loadIp={this.loadIp} />
                </div>
            </>
            
        );
    }
}

export default IPPolicy;