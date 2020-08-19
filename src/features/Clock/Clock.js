import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import moment from 'moment';
import PropTypes from 'prop-types';
import Select from 'react-select';
import {
  update,
  selectClock,
} from './clockSlice';

import styles from './Clock.module.css';

const defaultOptions = [{
    value: 10,
    label: 'Владивосток',
}, {
    value: 2,
    label: 'Калининград',
}, {
    value: 7,
    label: 'Красноярск',
}, {
    value: 3,
    label: 'Москва',
}];

/**
 * Method for getting degree values
 * based on provided time
 *
 * @param {object} currentTime -
 * @returns {object} pointer position degree values
 * for hour, minute, seconds
 */
const getPointersDegree = (currentTime) => {
    let state = {
        hours: 0,
        minutes: 0,
        seconds: 0,
    }
    // Offset value for correct position from top of circle
    const offsetDegree = 180;
    const fullCircleDegree = 360;
    const hoursInCircle = 12;
    const minSecInCircle = 60;
    const degreeOnOneHour = fullCircleDegree / hoursInCircle;
    const degreesFromMinSecOnCircle = (fullCircleDegree / minSecInCircle);
    state.minutes = degreesFromMinSecOnCircle * currentTime.minutes - offsetDegree;
    // The ratio of the angle value in minutes from the whole circle
    const attitudeMinutesFromCircle = (degreesFromMinSecOnCircle * currentTime.minutes) / fullCircleDegree;
    // How many degrees from the hour of the current number of minutes
    const diffMinutesInHour = degreeOnOneHour * attitudeMinutesFromCircle;
    state.seconds = degreesFromMinSecOnCircle * currentTime.seconds - offsetDegree;
    // Let's calculate the angle value for the current hour and add a correction for the number of minutes
    state.hours = ((fullCircleDegree / hoursInCircle) * currentTime.hours) - offsetDegree + diffMinutesInHour;
    return state;
};

const Clock = ({
    updateInterval,
}) => {
    // Clock interval for clearing on unmount
    const [clockInterval, setClockInterval] = useState(null);
    // Current timezone
    const initTimezone = defaultOptions[0];
    const [timeZone, setTimezone] = useState(initTimezone);
    // Time from store
    const datetime = useSelector(selectClock);
    // Time with correct timezone
    const currentTime = moment(datetime).utcOffset(timeZone.value);
    const actualState = {
        hours: currentTime.hours(),
        minutes: currentTime.minutes(),
        seconds: currentTime.seconds(),
    }
    const degreeValues = getPointersDegree(actualState);

    const dispatch = useDispatch();

    // Mount component
    useEffect(() => {
        const minUpdateInterval = 500;
        const updateIntervalTime = updateInterval > minUpdateInterval
            ? updateInterval
            : minUpdateInterval;
        const interval = setInterval(() => {
            dispatch(update());
        }, updateIntervalTime);
        setClockInterval(interval)
        return () => {
            // Unmount component
            clearInterval(clockInterval);
        };
    }, []);

    return (
        <div className={styles.container}>
            <div className={styles.clock}>
                <div
                    className={styles.clock__hours}
                    style={{ transform: `rotate(${degreeValues.hours}deg)` }}
                />
                <div
                    className={styles.clock__minutes}
                    style={{ transform: `rotate(${degreeValues.minutes}deg)` }}
                />
                <div
                    className={styles.clock__seconds}
                    style={{ transform: `rotate(${degreeValues.seconds}deg)` }}
                />
            </div>
            <div className={styles.time}>
                {moment(currentTime).format('HH:mm:ss')}
            </div>
            <div className={styles.select}>
                <Select
                    options={defaultOptions}
                    value={timeZone}
                    onChange={setTimezone}
                />
            </div>
        </div>
    );
}

Clock.propTypes = {
    updateInterval: PropTypes.number
};

Clock.defaultProps = {
    updateInterval: 1000,
};

export default Clock;
