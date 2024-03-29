import { React, useEffect, useContext, useState } from "react";
import JoinYourFriendsPic from "../../../Assets/JoinYourFriendsPic.gif";
import classes from "./JoinYourFriends.module.css";
import { AuthContext } from "../../../Auth/AuthProvider";
import { editEvent, listenToEvent } from "../../../Firestore/DatabaseManager";
import { useHistory } from "react-router";
import LoadingModal from "../../Modals/LoadingModal";

// Autocomplete Search
import AutocompleteSearch from "../../../Maps/AutocompleteSearch";
import { LoginModal } from "../../Modals/LoginModal";
// import useNearbySearch from '../../../Maps/NearbySearch'

export default function JoinYourFriends(props) {
  const currentEvent = props.event;
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  
  let updatedLat = currentEvent && currentEvent.totalCoordinates[0];
  let updatedLong = currentEvent && currentEvent.totalCoordinates[1];
  const { currentUser } = useContext(AuthContext);


  //check if the maximum number of participants has been reached
  const [disableJoin, setDisableJoin] = useState(false);

  useEffect(()=>{
    if (currentEvent){
      if (currentEvent.maxParticipants == currentEvent.participantsID.length){
        setDisableJoin(true);
      }
    }
  }, [currentEvent]);

  // useEffect(()=>{
  //   if (currentEvent){
  //     listenToEvent(currentEvent.eventID, props.setEventState)
  //   }
  // },[currentEvent])

  

  let currentUserDetails = {
    name: currentUser ? currentUser.displayName : "",
    id: currentUser ? currentUser.uid : "",
  };
  

  let updatedParticipantsID = currentEvent ? currentEvent.participantsID : [];
  

  // const joinWithCustomLocationHandler = (location) => {
  //   // first thing is set loading state
  //   setLoading(true);
  // };

  const joinWithCustomLocationHandler = (location) => {
    // setLoading(true);

    // console.log(location);
    // console.log(location.lat);
    // console.log(location.lng);
    finishJoiningEvent(location);
  };

  const finishJoiningEvent = async (location) => {
    console.log(currentEvent);
    console.log(location);
    updatedLat += location.lat;
    updatedLong += location.lng;
    updatedParticipantsID.push(currentUserDetails);
    // console.log("HERE", updatedParticipantsID);

    let updatedEvent = {
      ...currentEvent,
      totalCoordinates: [updatedLat, updatedLong],
      //add participant ID
    };
    console.log(updatedEvent);
    setLoading(true);
    await submitHandler(updatedEvent);
    // history.push("/home");
    // window.location.reload()
  };

  const currentLocationHandler = (e) => {
    console.log(e);
    // setLoading(true);
    navigator.geolocation.getCurrentPosition(success, error, options);
    // setLoading(false);
  };

  //some random options for the geolocation call
  var options = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0,
  };

  

  //success callback for geolocation call
  const success = async (pos) => {
    updatedLat += pos.coords.latitude;
    updatedLong += pos.coords.longitude;
    updatedParticipantsID.push(currentUserDetails);
    console.log(updatedParticipantsID);

    let updatedEvent = {
      ...currentEvent,
      totalCoordinates: [updatedLat, updatedLong],
    };
    console.log(updatedEvent);
    setLoading(true);
    await submitHandler(updatedEvent);
    history.push("/home");
  };

  //error callback for geolocation
  const error = (err) => {
    console.log("ERROR", err);
  };

  const submitHandler = async (event) => {
    console.log(event);
    setLoading(true);
    await editEvent(event);
    setLoading(false);
  };

  return (
    <div className={classes.root}>
      {!props.authed && <LoginModal setAuthed={props.setAuthed} />}
      <div>
        <img src={JoinYourFriendsPic} className={classes.pic} />
      </div>
      <div>
        <h1 className={classes.join}>Join Your Friends</h1>
        <h3 className={classes.text1}>Respond to {updatedParticipantsID[0] ? updatedParticipantsID[0].name : "Host"}'s invite with your location!</h3>
        {/* NOTE: STILL NEEDA PASS IN PROPS AND MAKE NAME RESPONSIVE */}
        <h3 className={classes.text2}>
          We’ll take your location into consideration, before suggesting a
          handful of optimal diners for to{" "}
          {updatedParticipantsID[0] ? updatedParticipantsID[0].name : "Host"} to
          choose based on their location, reviews and what’s still open at this
          time!
        </h3>
      </div>
      <div className={classes.bottom}>
        <button className={classes.button1} onClick={currentLocationHandler} disabled={disableJoin}>
          {disableJoin ? "Sorry, event is full" : "Join with Current Location"}
        </button>
        {/* <h3 className={classes.text3}>or</h3> */}
        {!disableJoin && <div className={classes.searchBoxContainer}>
          <AutocompleteSearch
            placeholder="Join with custom location"
            buttonText="Join!"
            errorTextColor="white"
            searchBoxActionClicked={joinWithCustomLocationHandler}
          />
        </div>}
        {/* <button className={classes.button2}>
          Join with postal code{" "}
          <i style={{ marginLeft: "10px" }} class="fa fa-arrow-right"></i>
        </button> */}
        {/* {loading && <p className={classes.text4}>loading </p>} */}
        {/* <LoadingModal isLoading = { loading }/> */}
      </div>
    </div>
  );
}
