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

      if(cityId){
         const query = firestore.collection('comments').where('cityId', '==', cityId);
         let comments = [];

         query.onSnapshot(querySnapshot => {
           if(!querySnapshot.empty) {
            querySnapshot.docChanges().forEach(change => {
               if(change.type === "added"){
                  comments.push({...change.doc.data(), id: change.doc.id});
               }
               if (change.type === "modified") {
                  console.log("Modified city: ", change.doc.data());
                  for( let i = 0; i <= comments.length-1; i++){
                     if ( comments[i].id === change.doc.id) {
                        console.log("here is the comment to change", change.doc.data())
                       comments[i] = {...change.doc.data(), id: change.doc.id}; 
                     }
                  }
               }
               if (change.type === "removed") {
                  for( let i = 0; i <= comments.length-1; i++){
                     if ( comments[i].id === change.doc.id) {
                       comments.splice(i, 1); 
                     }
                  }
               }
               dispatch({ type: 'GET_COMMENTS_SUCCESS', comments })
            }, err => {
               console.log(`Encountered error: ${err}`);
            });
 
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

export const deleteComment = (commentId) => {
   return (dispatch, getState, { getFirebase, getFirestore }) => {

      const firestore = getFirestore();

      if(commentId){
         const commentsRef = firestore.collection('comments');

         commentsRef.doc(commentId).delete()
         .then(() => {
            console.log("Document successfully deleted!");
            dispatch({ type: 'DELETE_COMMENT_SUCCESS' })
         })
         .catch((err) => {
            console.error("Error removing document: ", err);
            dispatch({ type: 'DELETE_COMMENT_ERROR', err })
         });
            
      }

   }
};

export const editComment = (commentId) => {
   return (dispatch, getState, { getFirebase, getFirestore }) => {

      const firestore = getFirestore();

      if(commentId){
         const commentsRef = firestore.collection('comments');

         commentsRef.doc(commentId).get()
         .then((doc) => {
            if (!doc.exists) {
            console.log('No such document!');
            } else {
            const comment = {...doc.data(), id: doc.id}
            dispatch({ type: 'EDIT_COMMENT_SUCCESS', comment })
            }
         })
         .catch((err) => {
            console.error("Error editing comment: ", err);
            dispatch({ type: 'EDIT_COMMENT_ERROR', err })
         });
            
      }

   }
};

export const updateComment = (updatedComment) => {
   return (dispatch, getState, { getFirebase, getFirestore }) => {

      const firestore = getFirestore();

      if(updatedComment.id){
         const commentsRef = firestore.collection('comments');
         commentsRef.doc(updatedComment.id).update({
            cityId: updatedComment.cityId,
            content: updatedComment.content,
            updatedAt: new Date(),
            userFirstName: updatedComment.userFirstName,
            userId: updatedComment.userId,
            userLastName: updatedComment.userLastName
         })
         .then(() => {
            console.log("Document successfully updated!");
            dispatch({ type: 'UPDATE_COMMENT_SUCCESS' })
         })
         .catch((err) => {
            console.error("Error updating comment: ", err);
            dispatch({ type: 'UPDATE_COMMENT_ERROR', err })
         });
      }

   }
};
