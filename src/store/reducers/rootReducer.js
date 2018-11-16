import authReducer from './authReducer'
import rankReducer from './rankReducer'
import { combineReducers } from 'redux'
import { firestoreReducer } from 'redux-firestore'
import { firebaseReducer } from 'react-redux-firebase'

const rootReducer = combineReducers({
   auth: authReducer,
   rank: rankReducer,
   firestore: firestoreReducer,
   firebase: firebaseReducer
})

export default rootReducer;