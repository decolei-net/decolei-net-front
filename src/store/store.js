import { configureStore, combineReducers } from '@reduxjs/toolkit';
import authReducer from './authSlice.js';

const loadState = () => {
  try {
    const serializedState = localStorage.getItem('app_state');

    if (serializedState === null) {
      return undefined;
    }

    return JSON.parse(serializedState);
  } catch (err) {
    return undefined;
  }
};

const saveState = (state) => {
  try {
    // AVISO: Havia um ".at" sobrando aqui, eu corrigi.
    const serializedState = JSON.stringify(state);
    localStorage.setItem('app_state', serializedState);
  } catch (err) {
    console.error('Erro ao salvar o state  da aplicação: ', err);
  }
};

const rootReducer = combineReducers({
  auth: authReducer,
});

const preloadedState = loadState();

const store = configureStore({
  reducer: rootReducer,
  // middleware: [thunk], // <--- 2. REMOVA ESTA LINHA TAMBÉM
  preloadedState,
});

store.subscribe(() => {
  saveState({ auth: store.getState().auth });
});

// Adicione esta linha para exportar a store
export default store;
