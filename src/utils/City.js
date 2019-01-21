import firebase from '../config/firebaseConfig'

export async function getCityByName(cityName) {
   try {
      const firestore = firebase.firestore();
      const citiesRef = firestore.collection('cities');
      if(cityName) {
         let citySearch = await citiesRef.where('cityName', '==', cityName).get()
         .then(snapshot => {
            if(!snapshot.empty){
               const city = snapshot.docs[0].data()
               city["cityId"] = snapshot.docs[0].id
               return city
            }
            else{
               return false
            }
         })
         .catch(err => {
            console.log("City find error", err)
         });
         return citySearch;
      }
   }
   catch(err) {
      console.log(err);
   }
};

export async function getCityById(cityId) {
   try {
      const firestore = firebase.firestore();
      const citiesRef = firestore.collection('cities');
      if(cityId) {
         let citySearch = await citiesRef.doc(cityId).get()
         .then(snapshot => {
            if(!snapshot.empty){
               const city = snapshot.data()
               city["cityId"] = snapshot.id
               return city
            }
            else{
               return false
            }
         })
         .catch(err => {
            console.log("City find error", err)
         });
         return citySearch;
      }
   }
   catch(err) {
      console.log(err);
   }
};
 