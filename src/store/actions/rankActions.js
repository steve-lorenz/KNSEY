export const createRanking = (ranking) => {
   return (dispatch, getState, { getFirebase, getFirestore }) => {

      const firestore = getFirestore();
      const profile = getState().firebase.profile;
      const userId = getState().firebase.auth.uid;

      firestore.collection('rankings').add({
         ...ranking,
         userFirstName: profile.firstName,
         userLastName: profile.lastName,
         userId: userId
      })
      .then(() => {
         dispatch({ type: 'CREATE_RANKING', ranking });
      })
      .catch((err) => {
         dispatch({ type: 'CREATE_RANKING_ERROR', err })
      })
   }
};