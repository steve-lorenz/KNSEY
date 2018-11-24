const initState = {}

const cityReducer = (state=initState, action) => {
   switch(action.type) {
      case 'CREATE_CITY':
         console.log('Created city', action.city);
         return state;
      case 'CREATE_CITY_ERROR':
         console.log('Create city error', action.err);
         return state;
      case 'GET_CITY_SUCCESS':
         console.log('Get city successful', action.city);
         const { city } = action;
         return {
            ...state,
            cityId: city.cityId,
            cityName: city.cityName,
            country: city.country,
            state: city.state
         }
      case 'GET_CITY_ERROR':
         console.log('Get city error', action.err);
         return state;
      case 'CITY_NOT_FOUND':
         console.log('City not found', action);
         return state;
      case 'SET_CITY_SUCCESS':
         console.log('City set success', action.city);
         return {
            ...state,
            cityName: action.city.cityName,
            country: action.city.country,
            state: action.city.state
         }
      case 'SET_CITY_FAILURE':
         console.log('City set failed');
         return state;
      default:
         return state;
   }
} 

export default cityReducer