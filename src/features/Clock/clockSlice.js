import { createSlice } from '@reduxjs/toolkit';
import moment from 'moment';
import dateFormat from '../../constants';

export const clockSlice = createSlice({
  name: 'clock',
  initialState: {
    datetime: moment().format(),
  },
  reducers: {
    update: state => {
      state.datetime = moment().format();
      console.log('update reducer', state.datetime);
    },
  },
});

export const { update } = clockSlice.actions;

export const selectClock = state => state.clock.datetime;

export default clockSlice.reducer;
