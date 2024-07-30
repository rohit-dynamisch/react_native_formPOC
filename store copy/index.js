import { combineReducers, createStore } from "redux";
import { todoReducer } from "./Reducers/todoReducer";
import { authReducer } from "./Reducers/authReducer";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { persistStore, persistReducer } from "redux-persist";
const persistConfig = {
  key: "root",
  storage: AsyncStorage,
};
const rootReducer = combineReducers({
  todos: todoReducer,
  auth: authReducer,
});
const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = createStore(persistedReducer);

export default store;
export const persistor = persistStore(store);
