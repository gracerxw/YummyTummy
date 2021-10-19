import React from "react";
import { useState, useEffect } from "react";
import pic from "../../../Assets/location_by_Icons8.gif";
import {
  useNearbySearch,
  getNearbyRestaurants,
} from "../../../Maps/UseNearbySearch";
// import LoadingModal from "../../Modals/LoadingModal";

//css
import classes from "./HostSearch.module.css";

//network
import { updateRecommendedEateries } from "../../../Firestore/DatabaseManager";

export default function HostSearch(props) {
  const [showEateries, setShowEateries] = useState(false);
  const [loading, setLoading] = useState(false)

  useNearbySearch();

  const didFinishGettingNearbyRestaurants = async (recommendedEateries) => {
    console.log("hello")
    const didUpload = await updateRecommendedEateries(props.eventID, recommendedEateries);

    if (didUpload){
      window.location.reload();
    }
    // need to check for success
    // reload
    props.setEventState((prev) => {
      return { ...prev, recommendedEateries: recommendedEateries };
    });
  };

  const toggleShowEateries = () => {
    setShowEateries((prev) => !prev);
    if (props.location) {
      console.log(props.location);
      console.log(props.participantsList.length);
      // console.log(props.location / props.participantsList.length)

      setLoading(true);

      getNearbyRestaurants(
        {
          lat: props.location[0] / props.participantsList.length,
          lng: props.location[1] / props.participantsList.length,
        },
        didFinishGettingNearbyRestaurants
      );
    }else{
      // handle error
    }
  };


  return (
    <div className={classes.root}>
      <img src={pic} className={classes.img} />
      <div id="map"></div>
      <div className={classes.text}>
        <h1 className={classes.title}>Search</h1>
        <p
          className={`${classes.description}`}
        >
          When all friends have responded, hit the search button!
        </p>
        <p className={classes.description}>
          We’ll suggest a handful of optimal diners for you to choose based on
          their location, reviews and what’s still open at this time!
        </p>
        <button className={classes.btn} onClick={toggleShowEateries}>
          Search
        </button>
        {loading && <p className={classes.text1}>Loading </p>}
        {/* <LoadingModal isLoading = {loading} /> */}
      </div>
    </div>
  );
}
