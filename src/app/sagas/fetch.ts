import {call, cancel, fork, put, take} from 'redux-saga/effects'
import {EventChannel, eventChannel, Task} from 'redux-saga'
import {createBook, symbol as symbolAction, updateBook} from '../../features/book/bookSlice';
import {BookSnapshot, Chunk, SYMBOLS, wsSubscribeParams} from "./types";

type SubPayload = {
    event:any
} | [
    subNum: number,
    data: Chunk | BookSnapshot
]
const defaultParams: wsSubscribeParams = {
    event: 'subscribe',
    channel: 'book',
    symbol: SYMBOLS.BTC
}
// this function creates an event channel from a given socket
// Setup subscription to incoming events
function createSocketChannel(socket: WebSocket): EventChannel<SubPayload | Error> {
    // `eventChannel` takes a subscriber function
    // the subscriber function takes an `emit` argument to put messages onto the channel
    return eventChannel(emit => {

        const pingHandler = (event: MessageEvent) => {
            // puts event payload into the channel
            // this allows a Saga to take this payload from the returned channel
            emit(JSON.parse(event.data));
            console.log(JSON.parse(event.data))
        }

        const errorHandler = (errorEvent) => {
            // create an Error object and put it into the channel
            emit(new Error(errorEvent.reason))
        }

        // setup the subscription
        socket.onmessage = pingHandler;
        // socket.on('error', errorHandler)

        // the subscriber must return an unsubscribe function
        // this will be invoked when the saga calls `channel.close` method
        const unsubscribe = () => {
            socket.close()
        }

        return unsubscribe
    })
}
function filterEvents(payload) {
    return !payload.event;
}
export default function* saga() {
    let symbol: SYMBOLS = defaultParams.symbol;
    let socket: WebSocket = yield call(createWebSocketConnection);
    let socketChannel: EventChannel<SubPayload> = yield call(createSocketChannel, socket);
    let wb: Task = yield fork(watchBooks, socketChannel);
    socket.send(JSON.stringify(defaultParams));
    while (true) {
        yield take('cp');
        symbol = symbol === SYMBOLS.BTC ? SYMBOLS.LTC : SYMBOLS.BTC;
        yield cancel(wb);
        socket.close();
        socketChannel.close();
        socket = yield call(createWebSocketConnection);
        socketChannel = yield call(createSocketChannel, socket);
        socket.send(JSON.stringify({
            ...defaultParams,
            symbol
        }));
        wb = yield fork(watchBooks, socketChannel);
        yield put(symbolAction(symbol))
    }
}
function* watchBooks(socketChannel) {
    // TODO Find out why
    // var bookReceived = false;
    /*Alternative implementation to this line `if (payload[1][0][0]) {` Then need to implement getSnapshot
    * as a sequential call and only then start receiving updates. More preferable*/
    // yield call(getSnapshot, socket)
        while (true) {
            try {
                // An error from socketChannel will cause the saga jump to the catch block
                const payload: SubPayload = yield take(socketChannel);
                if (filterEvents(payload)) {
                    if (payload[1][0][0]) {
                        yield put(createBook(payload[1]));
                        // bookReceived = true;
                    } else {
                        yield put(updateBook(payload[1]))
                    }
                }
            } catch (err) {
                console.error('socket error:', err)
                // socketChannel is still open in catch block
                // if we want end the socketChannel, we need close it explicitly
                // socketChannel.close()
            }
        }
}
async function createWebSocketConnection() {
    const ws = new WebSocket('wss://api-pub.bitfinex.com/ws/2');
    return await new Promise((res)=>{ws.onopen = function () {
        res(ws)
    }})
}
