export const createCity = (city) => {
   return (dispatch, getState, { getFirestore }) => {
      console.log("City Stuff", city);
      const firestore = getFirestore();
      const citiesRef = firestore.collection('cities');
      if(city.cityName) {
         citiesRef.where('cityName', '==', city.cityName).where('state', '==', city.state).get()
         .then(snapshot => {
            if(snapshot.empty) {
               firestore.collection('cities').add({
                  ...city
               })
               .then((docRef) => {
                  dispatch({ type: 'CREATE_CITY', ...city, id: docRef.id });
               })
               .catch((err) => {
                  dispatch({ type: 'CREATE_CITY_ERROR', err })
               })
            }
            else{
               console.log("City already exist.")
            }
         })
         .catch(err => {
            console.log('Error getting documents', err);
         });
      }
   }
};

export const getCity = (cityName) => {
   return (dispatch, getState, { getFirestore }) => {

      const firestore = getFirestore();
      const citiesRef = firestore.collection('cities');
      if(cityName) {
         citiesRef.where('cityName', '==', cityName).get()
         .then(snapshot => {
            if(!snapshot.empty){
               const city = snapshot.docs[0].data()
               city["cityId"] = snapshot.docs[0].id
               dispatch({ type: 'GET_CITY_SUCCESS', city });
            }
            else{
               dispatch({ type: 'CITY_NOT_FOUND' });
            }
         })
         .catch(err => {
            console.log('Error getting documents', err);
            dispatch({ type: 'GET_CITY_ERROR', err });
         });
      }
   }
};

export const setCity = (city) => {
   return (dispatch) => {

      if(city) {
         dispatch({ type: 'SET_CITY_SUCCESS', city });
      }
      else{
         dispatch({ type: 'SET_CITY_FAILURE', city });
      }
   
   }
};

