export const createRanking = (ranking) => {
   return (dispatch, getState, { getFirebase, getFirestore }) => {

      const firestore = getFirestore();
      const profile = getState().firebase.profile;
      const userId = getState().firebase.auth.uid;
      const citiesRef = firestore.collection('cities');

      citiesRef.where('cityName', '==', ranking.cityName).get()
      .then(snapshot => {
         if(!snapshot.empty) {
            firestore.collection('rankings').add({
               starRating: ranking.starRating,
               cityId: snapshot.docs[0].id,
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

       })
       .catch(err => {
         console.log('Error getting documents', err);
       });
   }
};