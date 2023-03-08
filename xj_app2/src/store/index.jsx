import {createStore, applyMiddleware} from 'redux'
import logger from 'redux-logger'
import rootReducer from './reducers'

const configStore = initState => {
  return createStore(
    rootReducer,
    initState,
    // applyMiddleware(logger)
  )
}

// 初始化initState
const initState = {}

const store = configStore(initState)
// // 订阅state
// store.subscribe(() => {
//   const state = store.getState()
//   data.set('store', state)
// })
export default store
