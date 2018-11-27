const initState = {}

const rankReducer = (state=initState, action) => {
   switch(action.type) {
      case 'CREATE_RANKING':
         return state;
      case 'CREATE_RANKING_ERROR':
         return state;
      case 'GET_RANKING_SUCCESS':
         const { ranking } = action
         return {
            ...state,
            average: ranking.average,
            userRanking: ranking.userRanking
         }
      case 'GET_RANKING_ERROR':
         return state;
      case 'RANKING_NOT_FOUND':
         return {
            ...ranking
         }
      case 'GET_USER_RANKING_SUCCESS':
         return {
            ...state,
            average: action.ranking.starRating
         }
      case 'GET_USER_RANKING_ERROR':
         return state;
      case 'GET_USER_RANKING_NOT_FOUND':
         return {
            ...ranking
         } 
      default:
         return state;
   }
} 

export default rankReducer