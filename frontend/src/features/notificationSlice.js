import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  count: 0,
};

const notificationSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    incrementNotificationCount: (state) => {
      state.count += 1;
    },
    resetNotificationCount: (state) => {
      state.count = 0;
    },
    setNotificationCount: (state, action) => {
      state.count = action.payload;
    },
  },
});

export const { incrementNotificationCount, resetNotificationCount, setNotificationCount } = notificationSlice.actions;

export default notificationSlice.reducer;