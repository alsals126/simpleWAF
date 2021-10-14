import React from 'react';
import {Route, BrowserRouter} from 'react-router-dom'; //React-Router import
import MainView from './view/MainView';
import Ippolicy from './view/ipPolicy';
import LogView from './view/logview'

function App(){
  return(
    <div>
      <BrowserRouter>
        <Route path="/" component={MainView} exact/>
        <Route path="/ip-policy" component={Ippolicy} exact/>
        <Route path="/log" component={LogView} exact/>
      </BrowserRouter>
    </div>
  )
}

export default App;
