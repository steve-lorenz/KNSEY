import firebase from '../config/firebaseConfig';

export async function createUserRanking(ranking, userId, profile) {
  try {
    const firestore = firebase.firestore();
    const rankingsRef = firestore.collection('rankings');
    const { cityId } = ranking.city;

    if (cityId) {
      const createRanking = await rankingsRef.where('userId', '==', userId).where('cityId', '==', cityId).get()
        .then((snapshot) => {
          if (snapshot.empty) {
            return firestore.collection('rankings').add({
              starRating: ranking.starRating,
              cityId,
              userFirstName: profile.firstName,
              userLastName: profile.lastName,
              userId,
            })
              .then((docRef) => docRef.id)
              .catch((err) => {
                console.log(err);
              });
          }
          return false;
        })
        .catch((err) => {
          console.log(err);
        });
      return createRanking;
    }

    return false;
  } catch (err) {
    console.log(err);
  }
}

export async function createCityRanking(ranking) {
  try {
    const firestore = firebase.firestore();
    const rankingsRef = firestore.collection('rankings');
    const citiesRef = firestore.collection('cities');
    const { cityId } = ranking;

    if (cityId) {
      const updateRankings = await rankingsRef.where('cityId', '==', cityId).get()
        .then((snapshot) => {
          if (!snapshot.empty) {
            const numberOfRankings = snapshot.size;
            const rankings = [];
            snapshot.forEach((doc) => {
              rankings.push(doc.data().starRating);
            });

            const sum = rankings.reduce((total, amount) => total + amount);
            const rankingAverage = parseFloat((sum / numberOfRankings).toFixed(2));

            return citiesRef.doc(cityId).update({
              average: rankingAverage,
              totalRanking: numberOfRankings,
            })
              .then(() => 200)
              .catch((err) => {
                console.log(err);
              });
          }
        })
        .catch((err) => {
          console.log(err);
        });
      return updateRankings;
    }

    return false;
  } catch (err) {
    console.log(err);
  }
}

export async function getAllRankings() {
  try {
    const firestore = firebase.firestore();
    const citiesRef = firestore.collection('cities');

    const getAllRankings = await citiesRef.get()
      .then((snapshot) => {
        if (!snapshot.empty) {
          const cityRatings = [];
          snapshot.forEach((doc) => {
            const rankings = doc.data();
            rankings.cityId = doc.id;
            if (rankings.coords && rankings.average) cityRatings.push(rankings);
          });
          return cityRatings;
        }
      })
      .catch((err) => {
        console.log(err);
      });
    return getAllRankings;
  } catch (err) {
    console.log(err);
  }
}

export async function getRankingById(cityId) {
  try {
    const firestore = firebase.firestore();
    const citiesRef = firestore.collection('cities');

    if (cityId) {
      const rankSearch = await citiesRef.doc(cityId).get()
        .then((snapshot) => {
          if (!snapshot.empty) {
            const ranking = snapshot.data();

            return {
              average: ranking.average,
              userRanking: ranking.totalRanking,
            };
          }
        })
        .catch((err) => {
          console.log(err);
        });
      return rankSearch;
    }

    return false;
  } catch (err) {
    console.log(err);
  }
}

export async function getRankingByUser(cityId, userId) {
  try {
    const firestore = firebase.firestore();
    const rankingsRef = firestore.collection('rankings');

    if (cityId) {
      const rankSearch = await rankingsRef.where('cityId', '==', cityId).where('userId', '==', userId).get()
        .then((snapshot) => {
          if (!snapshot.empty) {
            const userRating = snapshot.docs[0].data();
            return userRating.starRating;
          }
        })
        .catch((err) => {
          console.log(err);
        });
      return rankSearch;
    }

    return false;
  } catch (err) {
    console.log(err);
  }
}
