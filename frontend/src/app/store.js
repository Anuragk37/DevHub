import { configureStore } from '@reduxjs/toolkit';
import authRedurer from '../features/authSlice'
import {persistStore, persistReducer} from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import notificationReducer from '../features/notificationSlice'


const persistConfig = {
   key: 'root',
   storage,
}

const persistedAuthReducer = persistReducer(persistConfig,authRedurer)
const persistedNotificationReducer = persistReducer(persistConfig,notificationReducer)

const store = configureStore({
   reducer: {
      "auth":persistedAuthReducer,
      "notification":persistedNotificationReducer
   },
})

const persistor = persistStore(store)
export {store,persistor}