export const createCity = (city) => {
   return (dispatch, getState, { getFirebase, getFirestore }) => {

      const firestore = getFirestore();
      const citiesRef = firestore.collection('cities');

      citiesRef.where('cityName', '==', city.cityName).get()
      .then(snapshot => {
         if(snapshot.empty) {
            firestore.collection('cities').add({
               ...city
            })
            .then(() => {
               dispatch({ type: 'CREATE_CITY', city });
            })
            .catch((err) => {
               dispatch({ type: 'CREATE_CITY_ERROR', err })
            })
         }
       })
       .catch(err => {
         console.log('Error getting documents', err);
       });
   }
};

