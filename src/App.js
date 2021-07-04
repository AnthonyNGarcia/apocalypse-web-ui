import React from 'react';
import {BrowserRouter} from 'react-router-dom';
import {createStore, combineReducers} from 'redux';
import {Provider} from 'react-redux';
import generalReducer from './Redux/Reducers/generalReducer';
import lobbyReducer from './Redux/Reducers/lobbyReducer';
import gameReducer from './Redux/Reducers/gameReducer';
import gamePlayerReducer from './Redux/Reducers/GamePlayerReducer';
import gameBoardViewReducer from './Redux/Reducers/gameBoardViewReducer';
import battleViewReducer from './Redux/Reducers/battleViewReducer';
import cityMenuReducer from './Redux/Reducers/cityMenuReducer';
import chatReducer from './Redux/Reducers/chatReducer';
import outsideCityWallsBattleReducer from
  './Redux/Reducers/outsideCityWallsBattleReducer';
import DynamicContainerComponent from './Components/DynamicContainerComponent';
import './App.css';

const rootReducer = combineReducers({
  general: generalReducer,
  lobby: lobbyReducer,
  game: gameReducer,
  gamePlayer: gamePlayerReducer,
  gameBoardView: gameBoardViewReducer,
  battleView: battleViewReducer,
  cityMenu: cityMenuReducer,
  chat: chatReducer,
  outsideCityWallsBattle: outsideCityWallsBattleReducer,
});

export const store = createStore(rootReducer,
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__({
      trace: true, traceLimit: 25,
    }));

/**
 *
 * This is the root component that is inserted into the DOM at startup. It's
 * only job is to provide all the setup and configuration. For example, redux
 * and browser-router initialization.
 *
 * It intends to have only one child and nothing else: and that is the
 * Dynamic Container Component.
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
