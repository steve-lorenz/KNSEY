export const createRanking = (ranking) => {
   return (dispatch, getState, { getFirebase, getFirestore }) => {
      const firestore = getFirestore();
      const profile = getState().firebase.profile;
      const userId = getState().firebase.auth.uid;
      const citiesRef = firestore.collection('cities');
      const rankingsRef = firestore.collection('rankings');
      
      citiesRef.where('cityName', '==', ranking.city.cityName).get()
      .then(snapshot => {
         if(!snapshot.empty) {
            const cityId = snapshot.docs[0].id
            rankingsRef.where('userId', '==', userId).where('cityId', '==', cityId).get()
            .then(snapshot => {
               if(snapshot.empty){
                  firestore.collection('rankings').add({
                     starRating: ranking.starRating,
                     cityId: cityId,
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
         }

       })
       .catch(err => {
         console.log('Error getting documents', err);
       });
   }
};

export const getRanking = (cityId) => {
   return (dispatch, getState, { getFirebase, getFirestore }) => {

      if(cityId) {
         const firestore = getFirestore();
         const rankingsRef = firestore.collection('rankings');

         rankingsRef.where('cityId', '==', cityId).get()
         .then(snapshot => {

            if(!snapshot.empty){
               const numberOfRankings = snapshot.size;
               let rankings = []; 
               snapshot.forEach(doc => {
                  rankings.push(doc.data().starRating)
               });
      
               const sum = rankings.reduce((total, amount) => total + amount);
               const rankingAverage = parseFloat( (sum / numberOfRankings).toFixed(2) );
               const ranking = {
                  average: rankingAverage,
                  userRanking: numberOfRankings
               }
         
               dispatch({ type: 'GET_RANKING_SUCCESS', ranking });
            }

         })
         .catch(err => {
            dispatch({ type: 'GET_RANKING_ERROR', err });
         });
      }
      else {
         dispatch({ type: 'RANKING_NOT_FOUND' })
      }
   }
};

export const getUserRanking = (cityId) => {
   return (dispatch, getState, { getFirebase, getFirestore }) => {

      const userId = getState().firebase.auth.uid;
      if(cityId) {
         const firestore = getFirestore();
         const rankingsRef = firestore.collection('rankings');

         rankingsRef.where('userId', '==', userId).where('cityId', '==', cityId).get()
         .then(snapshot => {
            if(!snapshot.empty){
               const ranking = snapshot.docs[0].data()
               dispatch({ type: 'GET_USER_RANKING_SUCCESS', ranking });
            }

         })
         .catch(err => {
            dispatch({ type: 'GET_USER_RANKING_ERROR', err });
         });
      }
      else {
         dispatch({ type: 'GET_USER_RANKING_NOT_FOUND' })
      }
   }
};

