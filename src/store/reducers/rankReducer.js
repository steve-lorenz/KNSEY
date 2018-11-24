const initState = {}

const rankReducer = (state=initState, action) => {
   switch(action.type) {
      case 'CREATE_RANKING':
         console.log('Created ranking', action.ranking);
         return state;
      case 'CREATE_RANKING_ERROR':
         console.log('Create ranking error', action.err);
         return state;
      case 'GET_RANKING_SUCCESS':
         console.log('Get ranking success', action.ranking);
         const { ranking } = action
         return {
            ...state,
            average: ranking.average,
            userRanking: ranking.userRanking
         }
      case 'GET_RANKING_ERROR':
         console.log('Get ranking error', action.err);
         return state;
      case 'RANKING_NOT_FOUND':
         console.log('Rank not found', action);
         return {
            ...ranking
         }
      case 'GET_USER_RANKING_SUCCESS':
         console.log('Get User Ranking Successful', action.ranking);
         return {
            ...state,
            average: action.ranking.starRating
         }
      case 'GET_USER_RANKING_ERROR':
         console.log('Get user ranking error', action.err);
         return state;
      case 'GET_USER_RANKING_NOT_FOUND':
         console.log('User ranking not found', action);
         return {
            ...ranking
         } 
      default:
         return state;
   }
} 

export default rankReducer