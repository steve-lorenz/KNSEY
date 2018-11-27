const initState = {}

const commentReducer = (state=initState, action) => {
   switch(action.type) {
      case 'CREATE_COMMENT_SUCCESS':
         return state;
      case 'CREATE_COMMENT_ERROR':
         return state;
      case 'GET_COMMENTS_SUCCESS':
         return {
            comments: action.comments
         };
      case 'GET_COMMENTS_NOT_FOUND':
         const { comments } = action
         return {
            ...comments
         };
      case 'GET_COMMENTS_ERROR':
         return state;
      case 'DELETE_COMMENT_SUCCESS':
         return state;
      case 'DELETE_COMMENT_ERROR':
         return state;
      case 'EDIT_COMMENT_SUCCESS':
         return {
            ...state,
            editComment: action.comment
         };
      case 'EDIT_COMMENT_ERROR':
         return state;
      case 'UPDATE_COMMENT_SUCCESS':
         return state;
      case 'UPDATE_COMMENT_ERROR':
         return state;
      default:
         return state;
   }
} 

export default commentReducer