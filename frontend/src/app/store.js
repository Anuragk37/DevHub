import { configureStore } from '@reduxjs/toolkit';
import authRedurer from '../features/authSlice'
import {persistStore, persistReducer} from 'redux-persist'
import storage from 'redux-persist/lib/storage'

const persistConfig = {
   key: 'root',
   storage,
}

const persistedReducer = persistReducer(persistConfig,authRedurer)

const store = configureStore({
   reducer: {
      "auth":persistedReducer,
   },
})

const persistor = persistStore(store)
export {store,persistor}