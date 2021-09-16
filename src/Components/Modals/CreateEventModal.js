import React from "react";
import classes from "./CreateEventModal.module.css";
import pic from "../../Assets/eventpic.svg";
import Card from "../Card";

export default function CreateEventModal(props) {
  return (
    <div>
      <form className={classes.modal}>
        <Card
          left={
            <div className={classes.leftContainer}>
              <h2>Event Title:</h2>
              <input />
              <h2>Date & Time:</h2>
              <input type="datetime-local" />

              <h2>Max Pax:</h2>
              <input type="number" />

              <div className={classes.horiButtonGroup}>
                <button onClick={props.toggle} className={classes.cancelButton}>
                  Cancel
                </button>
                <button className={classes.createButton} type="submit">
                  Create
                </button>
              </div>
            </div>
          }
          right={
            <div className={classes.rightContainer}>
              <img src={pic} className={classes.pic} />

              <div className={classes.text}>
                <h1>Create an Event!</h1>
                <p>Fill in the details and hit create when you're done</p>
                <p>
                  Copy your event's unique URL and share it with your friends to
                  invite them!
                </p>
              </div>
            </div>
          }
        />
      </form>
      <div className={classes.overlay} onClick={props.toggle} />
    </div>
  );
}
