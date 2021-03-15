import {createAction, createSlice, PayloadAction} from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
import {stat} from "fs";
type Chunk = [
    number, number, number
]
export type CounterState = {
  bid: any[],
  ask: any[]
}

const initialState: CounterState = {
  bid: [],
  ask: []
}
function processChunk(bid, ask, chunk) {

  return [bid, ask];
}
export const counterSlice = createSlice({
  name: 'book',
  initialState,
  reducers: {
    createBook: (state: CounterState, data: PayloadAction<any>) => {
      const [bid, ask] = data.payload.reduce(( [bid, ask], chunk )=>{
        if (chunk[2]<0) ask.push(chunk); else bid.push(chunk);
        return [bid, ask];
      }, [ [], []]);
      state.bid = bid;
      state.ask = ask;
      return state
    },
    updateBook: (state, action) => {
      // delete 0
      if (action.payload[1]===0) {
        const ar = action.payload[2] < 0 ? state.ask : state.bid;
        const i = ar.findIndex(v=>v[0]===action.payload[0]);
        if (i<0)return state;
        ar.splice(i, 1);
        return state;
      }
      // upd and add
      const ar = action.payload[2] < 0 ? state.ask : state.bid;
      const i = ar.findIndex(v=>v[0]===action.payload[0]);
      if (i<0) {
        //add
        ar.push(action.payload);
        return state;
      }
      ar[i] = action.payload;
      return state
    }
  },
})

export const { createBook, updateBook } = counterSlice.actions;

// The function below is called a thunk and allows us to perform async logic. It
// can be dispatched like a regular action: `dispatch(incrementAsync(10))`. This
// will call the thunk with the `dispatch` function as the first argument. Async
// code can then be executed and other actions can be dispatched
export const incrementAsync = createAction<number>('incrementAsync')

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state: RootState) => state.counter.value)`
// export const selectCount = (state: RootState) => state.counter.value;

export default counterSlice.reducer;
