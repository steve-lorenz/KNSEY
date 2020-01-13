import firebase from '../config/firebaseConfig';

export async function createCityAsync(city) {
  try {
    const firestore = firebase.firestore();
    const citiesRef = firestore.collection('cities');
    if (city.cityName) {
      const createCity = await citiesRef.where('cityName', '==', city.cityName).where('state', '==', city.state).get()
        .then((snapshot) => {
          if (snapshot.empty) {
            return firestore.collection('cities').add({
              ...city,
            })
              .then((docRef) => {
                city.cityId = docRef.id;
                return city;
              })
              .catch((err) => {
                console.log(err);
              });
          }
          return false;
        })
        .catch((err) => {
          console.log('Error getting documents', err);
        });
      return createCity;
    }
  } catch (err) {
    console.log(err);
  }
}

export async function getCityByName(cityName) {
  try {
    const firestore = firebase.firestore();
    const citiesRef = firestore.collection('cities');
    if (cityName) {
      const citySearch = await citiesRef.where('cityName', '==', cityName).get()
        .then((snapshot) => {
          if (!snapshot.empty) {
            const city = snapshot.docs[0].data();
            city.cityId = snapshot.docs[0].id;
            return city;
          }
          return false;
        })
        .catch((err) => {
          console.log('City find error', err);
        });
      return citySearch;
    }
  } catch (err) {
    console.log(err);
  }
}

export async function getCityById(cityId) {
  try {
    const firestore = firebase.firestore();
    const citiesRef = firestore.collection('cities');
    if (cityId) {
      const citySearch = await citiesRef.doc(cityId).get()
        .then((snapshot) => {
          if (!snapshot.empty) {
            const city = snapshot.data();
            city.cityId = snapshot.id;
            return city;
          }
          return false;
        })
        .catch((err) => {
          console.log('City find error', err);
        });
      return citySearch;
    }
  } catch (err) {
    console.log(err);
  }
}
