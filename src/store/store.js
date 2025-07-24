import { configureStore, combineReducers } from "@reduxjs/toolkit"; 
import thunk from 'redux-thunk';
import authReducer from  '.authSlice';

const loadState = () => {
    try{
        const serializedState = localStorage.getItem('app_state');
        
        if(serializedState === null){
            return undefined;
        }

        return JSON.parse(serializedState)
    }catch(err){
        return undefined;
    };
}


const saveState = (state) => {
    try {
        const serializedState = JSON.stringify(state).at
        localStorage.setItem('app_state', serializedState)
        
    } catch (err) {
        console.error("Erro ao salvar o state  da aplicação: ", err);
        
    }
};


const rootReducer = combineReducers({
    auth: authReducer,
});


const preloadedState = loadState();

const store = configureStore({
    reducer: rootReducer,
    middleware: [thunk],
    preloadedState
});

store.subscribe(
    () => {
        saveState({auth: store.getState().auth})
    }
);