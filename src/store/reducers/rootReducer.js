import authReducer from './authReducer'
import rankReducer from './rankReducer'
import cityReducer from './cityReducer'
import { combineReducers } from 'redux'
import { firestoreReducer } from 'redux-firestore'
import { firebaseReducer } from 'react-redux-firebase'

const rootReducer = combineReducers({
   city: cityReducer,
   auth: authReducer,
   ranking: rankReducer,
   firestore: firestoreReducer,
   firebase: firebaseReducer,
})

export default rootReducer;