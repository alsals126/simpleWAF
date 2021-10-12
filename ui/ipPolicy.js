import React, { Component } from 'react'
import axios from "axios";
import ReactDOM from 'react-dom'

let endpoint = "http://127.0.0.1:8080";

class IPItem extends Component {
    render() {
        const {text} = this.props.ip
        return (
            <React.Fragment>
                <td>
                    <span>{text}</span>
                </td>
                <td>
                    <button onClick={() =>
                        this.props.handleIPRemove(this.props.idx)}>X</button>
                </td>
            </React.Fragment>
        )
    }
}
class IPList extends Component {
    render() {
        return (
            <table>
                <tbody>
                    {
                        this.props.ips.map((ip, idx) => {
                            return(
                                <tr>
                                <IPItem
                                    idx={idx}
                                    ip={ip}
                                    handleIPRemove={this.props.handleIPRemove} />
                                </tr>
                            )
                        })
                    }   
                </tbody>
            </table>
        )
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
    constructor(props) {
        super(props)
        this.state = {
            ips: []
        }
    }
    handleIPAdd = (newIp) => {
        this.setState((state) => ({
            ips: state.ips.concat(newIp)
        }))
    }
    handleIPRemove = (ipIndex) => {
        this.setState((state) => ({
            ips: state.ips.filter((_, idx) => {
                return idx !== ipIndex
            })
        }))
    }
    render() {
        return (
            <div>
                <IPAdder handleIPAdd={this.handleIPAdd} /><br/>
                <IPList
                    ips={this.state.ips}
                    handleIPRemove={this.handleIPRemove} />
            </div>
        );
    }
}

const rootElement = document.getElementById("root")
ReactDOM.render(<IPPolicy />, rootElement)