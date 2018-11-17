const initState = {
   authError: null
}

const authReducer = (state=initState, action) => {
   switch(action.type) {
      case 'LOGIN_ERROR':
         console.log('Login error') 
         return {
            ...state,
            authError: action.err.message
         }
      case 'LOGIN_SUCCESS':
         console.log('Login successful')
         return {
            ...state,
            authError: null
         }
      case 'LOGOUT_SUCCESS':
         console.log('Logout successful')
         return state
      case 'SIGNUP_SUCCESS':
         console.log('Sign Up successful')
         return {
            ...state,
            authError: null
         }
      case 'SIGNUP_ERROR':
         console.log('Sign Up error')
         return {
            ...state,
            authError: action.err.message
         }
      default:
         return state
   }
} 

export default authReducer