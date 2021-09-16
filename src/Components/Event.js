import React from 'react'
import classes from './Event.module.css'

export default function Event(props) {
    const PARTICIPANTARRAY = props.participants

    return (
        <div className = {classes.root}>
            <div className = {classes.leftContainer}>
                <h3 className={classes.eventTitle}>{props.title}</h3>
                <div>
                <p className = {classes.fontsize}>📍 {props.location}</p>
                <p className = {classes.fontsize}>⏰ {props.dateTime}</p>
                </div>
            </div>
            <div className = {classes.rightContainer}>
            {/* actually if too many, put ... */}
            {PARTICIPANTARRAY.map((participant, index) => (
            <p key={index} className = {classes.fontsize}>{participant}</p> 
            ))}
            </div>
        </div>
    )
}
