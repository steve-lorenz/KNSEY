const initState = {}

const cityReducer = (state=initState, action) => {
   switch(action.type) {
      case 'CREATE_CITY':
         return {
            ...state,
            cityId: action.id,
            cityName: action.cityName,
            country: action.country,
            state: action.state
         };
      case 'CREATE_CITY_ERROR':
         return state;
      case 'GET_CITY_SUCCESS':
         const { city } = action;
         return {
            ...state,
            cityId: city.cityId,
            cityName: city.cityName,
            country: city.country,
            state: city.state
         }
      case 'GET_CITY_ERROR':
         return state;
      case 'CITY_NOT_FOUND': 
         return {   
            ...city,
         }
      case 'SET_CITY_SUCCESS':
         return {
            ...state,
            cityName: action.city.cityName,
            country: action.city.country,
            state: action.city.state
         }
      case 'SET_CITY_FAILURE':
         return state;
      default:
         return state;
   }
} 

export default cityReducer