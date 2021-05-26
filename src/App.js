import React from 'react';
import {BrowserRouter} from 'react-router-dom';
import {createStore, combineReducers} from 'redux';
import {Provider} from 'react-redux';
import generalReducer from './Redux/Reducers/generalReducer';
import lobbyReducer from './Redux/Reducers/lobbyReducer';
import gameReducer from './Redux/Reducers/gameReducer';
import DynamicContainerComponent from './Components/DynamicContainerComponent';
import './App.css';

const rootReducer = combineReducers({
  general: generalReducer,
  lobby: lobbyReducer,
  game: gameReducer,
});

const store = createStore(rootReducer,
    window.__REDUX_DEVTOOLS_EXTENSION__ &&
    window.__REDUX_DEVTOOLS_EXTENSION__());

/**
 *
 * This is the root component that is inserted into the DOM at startup. It's
 * only job is to provide all the setup and configuration. For example, redux
 *  and browser-router initialization.
 *
 * It intends to have only one child and nothing else: the Game component.
 * and that is the Dynamic Container Component.
 *
 * @return {JSX} JSX
 */
function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <DynamicContainerComponent/>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
