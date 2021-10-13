import React, { Component } from 'react'
import axios from "axios";
import ReactDOM from 'react-dom'
import IpItem from "./IPItem";

let endpoint = "http://127.0.0.1:8080";

class Listpage extends Component {
   
    render() {
      const { Ipitem } = this.props;
      console.log(this.props)
      return (
        <ul>asdf
          {Ipitem &&
            Ipitem.map((itemdata) => {
                console.log("Asdf"+itemdata)
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
class IPPolicy extends Component {
    constructor(props){
        super(props)
        this.state = {
            loading: false,
            IpList: []
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
                IpList: tem
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
        const {IpList} = this.state;
        return (
            <div>
                <Listpage Ipitem={IpList} />
            </div>
        );
    }
}

const rootElement = document.getElementById("root")
ReactDOM.render(<IPPolicy />, rootElement)