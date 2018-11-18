const initState = {}

const cityReducer = (state=initState, action) => {
   switch(action.type) {
      case 'CREATE_CITY':
         console.log('Created city', action.city);
         return state;
      case 'CREATE_CITY_ERROR':
         console.log('Create city error', action.err);
         return state;
      default:
         return state;
   }
} 

export default cityReducer