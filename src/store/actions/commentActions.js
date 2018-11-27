export const createComment = (comment) => {
   return (dispatch, getState, { getFirebase, getFirestore }) => {

      const firestore = getFirestore();
      const profile = getState().firebase.profile;
      const userId = getState().firebase.auth.uid;
      const cityId = getState().city.cityId

      if(cityId){
         firestore.collection('comments').add({
            ...comment,
            userId : userId,
            cityId: cityId,
            userFirstName: profile.firstName,
            userLastName: profile.lastName,
            createdAt: new Date()
         })
         .then(() => {
            dispatch({ type: 'CREATE_COMMENT_SUCCESS', comment });
         })
         .catch((err) => {
            dispatch({ type: 'CREATE_COMMENT_ERROR', err });
         })
      }

   }
};

export const getComments = (cityId) => {
   return (dispatch, getState, { getFirebase, getFirestore }) => {

      const firestore = getFirestore();
      // const cityId = getState().city.cityId

      if(cityId){
         const query = firestore.collection('comments').where('cityId', '==', cityId);
         let comments = [];

         query.onSnapshot(querySnapshot => {
           if(!querySnapshot.empty) {
            querySnapshot.docChanges().forEach(change => {
               if(change.type === "added"){
                  comments.unshift({...change.doc.data(), id: change.doc.id});
               }           
            });
            console.log("Comments: ", comments)
            dispatch({ type: 'GET_COMMENTS_SUCCESS', comments })
           }
           else {
            dispatch({ type: 'GET_COMMENTS_NOT_FOUND' })
           }
         }, err => {
           console.log(`Encountered error: ${err}`);
           dispatch({ type: 'GET_COMMENTS_ERROR', err })
         });
      }

   }
};
