import React from 'react';
import logo from './logo.svg';
import { Counter } from './features/counter/Counter';
import './App.css';
import {useDispatch} from "react-redux";

function App() {
  const dispatch = useDispatch();
  return (
    <div className="App">
      <header className="App-header">
        <button onClick={()=>dispatch({type: 'cp'})} style={{width:300, height:100}}>Maintain Precision to P2</button>
        <Counter />
      </header>
    </div>
  );
}

export default App;
