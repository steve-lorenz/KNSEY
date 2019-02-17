import firebase from '../config/firebaseConfig'

export async function createUserRanking(ranking, userId, profile) {
   try {
      const firestore = firebase.firestore();
      const rankingsRef = firestore.collection('rankings');
      const cityId = ranking.city.cityId;

      if(cityId) {
        let createRanking = await rankingsRef.where('userId', '==', userId).where('cityId', '==', cityId).get()
         .then(snapshot => {
            if(snapshot.empty){
               return firestore.collection('rankings').add({
                  starRating: ranking.starRating,
                  cityId: cityId,
                  userFirstName: profile.firstName,
                  userLastName: profile.lastName,
                  userId: userId
               })
               .then((docRef) => {
                  return docRef.id
               })
               .catch((err) => {
                  console.log (err);
               })
            }
            else {
               return false;
            }
         })
         .catch(err => {
            console.log(err);
         });
         return createRanking;
      }
      else {
         return false;
      }
   }
   catch(err) {
      console.log(err);
   }
};

export async function createCityRanking(ranking) {
   try {
      const firestore = firebase.firestore();
      const rankingsRef = firestore.collection('rankings');
      const citiesRef = firestore.collection('cities');
      const cityId = ranking.city.cityId;

      if(cityId) {
        let updateRankings = await rankingsRef.where('cityId', '==', cityId).get()
         .then(snapshot => {
            if(!snapshot.empty){
               const numberOfRankings = snapshot.size;
               let rankings = []; 
               snapshot.forEach(doc => {
                  rankings.push(doc.data().starRating)
               });
      
               const sum = rankings.reduce((total, amount) => total + amount);
               const rankingAverage = parseFloat( (sum / numberOfRankings).toFixed(2) );

               return citiesRef.doc(cityId).update({
                  average: rankingAverage,
                  totalRanking: numberOfRankings,
               })
               .then(() => {
                  return 200;
               })
               .catch((err) => {
                  console.log(err);
               });
            }
         })
         .catch(err => {
            console.log(err);
         });
         return updateRankings;
      }
      else {
         return false;
      }
   }
   catch(err) {
      console.log(err);
   }
};

export async function getAllRankings() {
   try {
      const firestore = firebase.firestore();
      const citiesRef = firestore.collection('cities');
      
      let getAllRankings = await citiesRef.get()
      .then((snapshot) => {
         if(!snapshot.empty){
            let cityRatings = [];
            snapshot.forEach(doc => {
               const rankings = doc.data()
               rankings.cityId = doc.id
               if(rankings.coords && rankings.average) cityRatings.push(rankings)
            });
            return cityRatings
         }
      })
      .catch((err) => {
         console.log(err)
      });
      return getAllRankings;
   }
   catch(err) {
      console.log(err);
   }
};

export async function getRankingById(cityId) {
   try {
      const firestore = firebase.firestore();
      const citiesRef = firestore.collection('cities');
   
      if(cityId) {
         let rankSearch = await citiesRef.doc(cityId).get()
         .then(snapshot => {
            if(!snapshot.empty){
               const ranking = snapshot.data();

               return {
                  average: ranking.average,
                  userRanking: ranking.totalRanking
               }
            }
         })
         .catch(err => {
            console.log(err);
         });
         return rankSearch;
      }
      else {
         return false
      }
   }
   catch(err) {
      console.log(err);
   }
};

export async function getRankingByUser(cityId, userId) {
   try {
      const firestore = firebase.firestore();
      const rankingsRef = firestore.collection('rankings');
   
      if(cityId) {
         let rankSearch = await rankingsRef.where('cityId', '==', cityId).where('userId', '==', userId).get()
         .then(snapshot => {
            if(!snapshot.empty){
               const userRating = snapshot.docs[0].data();
               return userRating.starRating;
            }
      
         })
         .catch(err => {
            console.log(err);
         });
         return rankSearch;
      }
      else {
         return false
      }
   }
   catch(err) {
      console.log(err);
   }
};
