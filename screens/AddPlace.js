import PlaceForm from "../components/Places/PlaceForm";

function AddPlace({ navigation }) {
  function createPlaceHandler(place) {
    navigation.popTo("AllPlaces", {
      place,
    });
  }

  return <PlaceForm onCreatePlace={createPlaceHandler} />;
}

export default AddPlace;
