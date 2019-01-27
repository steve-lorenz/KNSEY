import firebase from '../config/firebaseConfig'

export async function getRankingById(cityId) {
   try {
      const firestore = firebase.firestore();
      const rankingsRef = firestore.collection('rankings');
   
      if(cityId) {
         let rankSearch = await rankingsRef.where('cityId', '==', cityId).get()
         .then(snapshot => {
            if(!snapshot.empty){
               const numberOfRankings = snapshot.size;
               let rankings = []; 
               snapshot.forEach(doc => {
                  rankings.push(doc.data().starRating)
               });
      
               const sum = rankings.reduce((total, amount) => total + amount);
               const rankingAverage = parseFloat( (sum / numberOfRankings).toFixed(2) );
               return {
                  average: rankingAverage,
                  userRanking: numberOfRankings
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

