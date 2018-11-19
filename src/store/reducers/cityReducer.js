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
<<<<<<< HEAD

      case 'CITY_NOT_FOUND':
         console.log('City not found', action);
         return {
            ...state,
            cityId: '',
            cityName: '',
            country: '',
            state: ''
=======
      case 'CITY_NOT_FOUND':
         console.log('City not found', action);
         return {
            ...city
>>>>>>> map view
         }
      default:
         return state;
   }
} 

export default cityReducer