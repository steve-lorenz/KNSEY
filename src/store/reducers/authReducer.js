const initState = {
   authError: null
}

const authReducer = (state=initState, action) => {
   switch(action.type) {
      case 'LOGIN_ERROR':
         console.log('Login error') 
         return {
            ...state,
            authError: 'Login Failed'

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
      default:
         return state
   }
} 

export default authReducer