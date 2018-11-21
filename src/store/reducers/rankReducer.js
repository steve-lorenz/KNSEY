const initState = {}

const rankReducer = (state=initState, action) => {
   switch(action.type) {
      case 'CREATE_RANKING':
         console.log('Created ranking', action.ranking);
         return state;
      case 'CREATE_RANKING_ERROR':
         console.log('Create ranking error', action.err);
         return state;
      default:
         return state;
   }
} 

export default rankReducer