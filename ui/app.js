import React from 'react';
import {Route, BrowserRouter} from 'react-router-dom'; //React-Router import
import MainView from './view/mainView';
import ipBlock from './view/ipBlock';
import userCustom from './view/userCustom';
import LogView from './view/logview'

function App(){
  return(
    <div>
      <BrowserRouter>
        <Route path="/" component={MainView} exact/>
        <Route path="/ip-block" component={ipBlock} exact/>
        <Route path="/user-custom" component={userCustom} exact/>
        <Route path="/log" component={LogView} exact/>
      </BrowserRouter>
    </div>
  )
}

export default App;
