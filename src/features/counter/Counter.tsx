import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
    CounterState

} from './counterSlice';
import styles from './Counter.module.css';
import {RootState} from '../../app/store'

export function Counter() {
  // @ts-ignore
    const {bid, ask}: CounterState = useSelector(state => state.book);
    // const sbid = bid.sort((a,b)=>b[0]-a[0]);
    // const sask = ask.sort((a,b)=>b[0]-a[0]);
    /*const viewDS = [...bid, ...ask].reduce((view, chunk)=>{
        const viewChunk = view[chunk[0]] || {};
        // of course we have to reuse logic
        viewChunk[chunk[2] < 0 ?'ask':'bid' ] = {
            amount: Math.abs(chunk[2]),
            count: chunk[1],
            price: chunk[0],
            total: Math.abs(chunk[2])*chunk[1]
        };
        view[chunk[0]] = viewChunk;
        return view;
    }, {});*/

  // const dispatch = useDispatch();
  // const [incrementAmount, setIncrementAmount] = useState('2');
    const bidView = bid.map(chunk =>{
        return(<tr key={chunk[0]}>
            <td>{chunk[1]}</td>
            <td>{Math.abs(chunk[2])}</td>
            <td>{Math.abs(chunk[2])* chunk[1]}</td>
            <td>{chunk[0]}</td>
        </tr>)
    });
    const askView = bid.map(chunk =>{
        return(<tr key={chunk[0]}>
            <td>{chunk[0]}</td>
            <td>{Math.abs(chunk[2])* chunk[1]}</td>
            <td>{Math.abs(chunk[2])}</td>
            <td>{chunk[1]}</td>
        </tr>)
    })
return (<div style={{display: 'flex'}}>
    <table><thead>
<th>COUNT</th>
<th>AMOUNT</th>
<th>TOTAL</th>
<th>PRICE</th>
</thead>
<tbody>
{bidView}
</tbody>
</table>
    <table><thead>
    <th>PRICE</th>
    <th>TOTAL</th>
    <th>AMOUNT</th>
    <th>COUNT</th>
    </thead>
        <tbody>
        {askView}
        </tbody>
    </table>
</div>);
}
