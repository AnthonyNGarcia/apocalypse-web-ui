import React, {useEffect, useRef} from 'react';
import {connect} from 'react-redux';
import axios from 'axios';
import apiEndpoints from './Utilities/apiEndpoints';
import MAIN_VIEWS from './Utilities/mainViews';
import PropTypes from 'prop-types';
import Lobby from './Lobby/Lobby';
import Game from './Game/Game';
import AbstractedWebsocket from './Utilities/websockets/AbstractedWebsocket';
import generalAC from '../Redux/actionCreators/generalActionCreators';
import flattenObject from './Utilities/flattenObjectValuesToArray';
import websocketMessageReceiver from
  './Utilities/websockets/websocketMessageReceiver';
import './DynamicContainerComponent.css';

/**
 *
 * This is the second highest container component in the application, where true
 * dynamic rendering begins to take place. It’s only purpose is to render one of
 * a few other big components based off very simple redux state.
 *
 * @param {Object} props passed from the parent component
 * @return {JSX} to render
 */
const DynamicContainerComponent = (props) => {
  const websocket = useRef(null);

  const onReceiveMessage = (message) => {
    console.log(message);
    websocketMessageReceiver(message.body);
  };

  const onDisconnect = () => {
    console.warn('Disconnected from game websocket!');
  };

  useEffect( () => {
    const fetchGuestData = async () => {
      const url = apiEndpoints.userController + '/guest';

      try {
        const response = await axios.get(url);
        const ownUsername = response.data.username;
        const ownUserId = response.data.userId;
        props.saveOwnUsername(ownUsername);
        props.saveOwnUserId(ownUserId);
      } catch (error) {
        console.warn('Error getting random username from server! Is it down?');
        console.warn(error);
      }
    };

    fetchGuestData();
  }, []);

  let viewToRender = (
    <React.Fragment>
      <p>Oops! An invalid view is being rendered to the screen...</p>
    </React.Fragment>
  );

  if (props.mainView === MAIN_VIEWS.LOBBY_VIEW) {
    viewToRender = (
      <React.Fragment>
        <Lobby/>
      </React.Fragment>
    );
  } else if (props.mainView === MAIN_VIEWS.GAME_VIEW) {
    viewToRender = (
      <React.Fragment>
        <Game/>
      </React.Fragment>
    );
  }

  return (
    <React.Fragment>
      <AbstractedWebsocket topics={props.websocketTopics}
        onReceiveMessage={onReceiveMessage} ref={websocket}
        onDisconnect={onDisconnect}/>
      {viewToRender}
    </React.Fragment>
  );
};

const mapStateToProps = (state) => {
  return {
    mainView: state.general.mainView,
    websocketTopics: state.general.websocketTopics,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    saveOwnUsername: (username) => dispatch(
        generalAC.setOwnUsername(username)),
    saveOwnUserId: (userId) => dispatch(
        generalAC.setOwnUserId(userId)),
  };
};

DynamicContainerComponent.propTypes = {
  mainView: PropTypes.oneOf(flattenObject(MAIN_VIEWS)),
  saveOwnUsername: PropTypes.func,
  saveOwnUserId: PropTypes.func,
  websocketTopics: PropTypes.arrayOf(PropTypes.string),
};

export default connect(mapStateToProps, mapDispatchToProps)(
    DynamicContainerComponent);
