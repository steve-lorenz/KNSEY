const initState = {}

const commentReducer = (state=initState, action) => {
   switch(action.type) {
      case 'CREATE_COMMENT_SUCCESS':
         console.log('Create comment successful', action.comment);
         return state;
      case 'CREATE_COMMENT_ERROR':
         console.log('Create comment error', action.err);
         return state;
      case 'GET_COMMENTS_SUCCESS':
         console.log('Get comments success', action.comments);
         return {
            comments: action.comments
         };
      case 'GET_COMMENTS_NOT_FOUND':
         const { comments } = action
         console.log('No comments found', action);
         return {
            ...comments
         };
      case 'GET_COMMENTS_ERROR':
         console.log('Get comments error', action.err);
         return state;
      default:
         return state;
   }
} 

export default commentReducer