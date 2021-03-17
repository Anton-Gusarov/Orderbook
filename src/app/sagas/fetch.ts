import {take, put, call, apply, delay, fork, takeLatest, cancel} from 'redux-saga/effects'
import {eventChannel} from 'redux-saga'
import {updateBook, createBook, symbol as symbolAction } from '../../features/counter/counterSlice';
import {SYMBOLS} from "./types";

// this function creates an event channel from a given socket
// Setup subscription to incoming `ping` events
function createSocketChannel(socket) {
    // `eventChannel` takes a subscriber function
    // the subscriber function takes an `emit` argument to put messages onto the channel
    return eventChannel(emit => {

        const pingHandler = (event) => {
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
/*function* watchParam(socket, socketChannel) {
    let wb = yield fork(watchBooks, socketChannel);
    socket.send(JSON.stringify(defaultParams));
    while (true) {
        const params = yield take('cp');
        yield cancel(wb);
        socket.close();
        socketChannel.close();
        socket = yield call(createWebSocketConnection);
        socketChannel = yield call(createSocketChannel, socket);
        socket.send(JSON.stringify({
            ...defaultParams,
            symbol:'tLTCUSD'
        }));
        wb = yield fork(watchBooks, socketChannel);
    }
}*/
export default function* saga() {
    let symbol = SYMBOLS.BTC;
    let socket = yield call(createWebSocketConnection);
    let socketChannel = yield call(createSocketChannel, socket);
    let wb = yield fork(watchBooks, socketChannel);
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
    // var bookReceived = false;
    // yield call(getSnapshot, socket)
        while (true) {
            try {
                // An error from socketChannel will cause the saga jump to the catch block
                const payload = yield take(socketChannel);
                if (!payload.event) {
                    if (payload[1][0][0]) {
                        yield put(createBook(payload[1]));
                        // bookReceived = true;
                    } else {
                        yield put(updateBook(payload[1]))
                    }
                }
                // yield fork(pong, socket)
            } catch (err) {
                console.error('socket error:', err)
                // socketChannel is still open in catch block
                // if we want end the socketChannel, we need close it explicitly
                // socketChannel.close()
            }
        }
}

const defaultParams = {
    event: 'subscribe',
    channel: 'book',
    symbol: 'tBTCUSD'
}
async function createWebSocketConnection() {
    const ws = new WebSocket('wss://api-pub.bitfinex.com/ws/2');

    return await new Promise((res)=>{ws.onopen = function () {
        res(ws)
    }})
}
