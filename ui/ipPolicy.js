import React, { Component } from 'react'
import axios from "axios";
import ReactDOM from 'react-dom'
import IpItem from './IPItem'

let endpoint = "http://127.0.0.1:8080";

class IPList extends Component {
    render() {
        const { Ipitem } = this.props;
        console.log(Ipitem)
        return (
          <ul>
            {Ipitem &&
              Ipitem.map((itemdata) => {
                  console.log(itemdata)
                return (
                  <IpItem
                    id={itemdata.id}
                    ip={itemdata.ip}
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
                    this.props.handleIPAdd({
                        completed: false,
                        text: this.state.ip
                    }) : null
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

    loadIp = async () =>{
        var tem = []
        axios({
            method:"get",
            url:endpoint+"/ip-proxy"
        })
        .then((res) => {
            // response  
            res.data.forEach((item) => {
                var ipInfo = { id: item.Id, ip: item.Ip };
                tem = tem.concat(ipInfo)
            })  
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
    // handleIPAdd = (newIp) => {
    //     this.setState((state) => ({
    //         ips: state.ips.concat(newIp)
    //     }))
    // }
    // handleIPRemove = (ipIndex) => {
    //     this.setState((state) => ({
    //         ips: state.ips.filter((_, idx) => {
    //             return idx !== ipIndex
    //         })
    //     }))
    // }

    componentDidMount(){
        this.loadIp();
    }

    render() {
        const {Iplist} = this.state;
        console.log(Iplist)
        return (
            <div>
                <IPAdder
                // handleIPAdd={this.handleIPAdd} 
                 /><br/>
                <IPList Ipitem={Iplist}/>
            </div>
        );
    }
}

const rootElement = document.getElementById("root")
ReactDOM.render(<IPPolicy />, rootElement)