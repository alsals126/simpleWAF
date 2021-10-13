import React, { Component } from 'react'
import axios from "axios";
import ReactDOM from 'react-dom'
import IpItem from './IPItem'

let endpoint = "http://127.0.0.1:8080";

class IPList extends Component {
    render() {
        const { Ipitem } = this.props;
        return (
          <ul>
            {Ipitem &&
              Ipitem.map((itemdata) => {
                return (
                  <IpItem
                    id={itemdata.id}
                    ip={itemdata.ip}
                    loadIp={this.props.loadIp}
                  />
                );
              })}
          </ul>
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
    insertIp = () => {
        var result = true

        // post 요청 보내기
        var bodyFormData = new FormData();
        bodyFormData.append('ip', this.state.ip);

        axios({
            method:"post",
            url:endpoint+"/ip-proxy",
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
                <input type='text' onChange={this.handleChange} value={this.state.ip} />
                <button onClick={ () => 
                    this.insertIp() ?         
                    this.props.loadIp() : null
                }>Add</button>
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

    // 처음 로드될 때 모든 데이터 부르기
    loadIp = async () =>{
        var tem = []
        axios({
            method:"get",
            url:endpoint+"/ip-proxy"
        })
        .then((res) => {
            // response  
            if(res.data != null){
                res.data.forEach((item) => {
                    var ipInfo = { id: item.Id, ip: item.Ip };
                    tem = tem.concat(ipInfo)
                })  
                this.setState({
                    loading: true,
                    Iplist: tem
                })
            }
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
            <div>
                <IPAdder
                    loadIp={this.loadIp} /><br/>
                <IPList Ipitem={Iplist} loadIp={this.loadIp} />
            </div>
        );
    }
}

const rootElement = document.getElementById("root")
ReactDOM.render(<IPPolicy />, rootElement)