import React, {useEffect} from 'react';
import {connect} from 'react-redux';
import axios from 'axios';
import apiEndpoints from './Utilities/apiEndpoints';
import MAIN_VIEWS from './Utilities/mainViews';
import PropTypes from 'prop-types';
import Lobby from './Lobby/Lobby';
import Game from './Game/Game';
import generalAC from '../Redux/actionCreators/generalActionCreators';
import flattenObject from './Utilities/flattenObjectValuesToArray';
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
  useEffect( () => {
    const fetchGuestData = async () => {
      const url = apiEndpoints.userController + '/random';

      try {
        console.log(url);
        const response = await axios.get(url);
        console.log(response);
        const ownUsername = response.data.randomUsername;
        props.saveOwnUsername(ownUsername);
      } catch (error) {
        console.log(error);
      }
    };

    fetchGuestData();
  }, []);

  if (props.mainView === MAIN_VIEWS.LOBBY_VIEW) {
    return (
      <React.Fragment>
        <Lobby/>
      </React.Fragment>
    );
  } else if (props.mainView === MAIN_VIEWS.GAME_VIEW) {
    return (
      <React.Fragment>
        <Game/>
      </React.Fragment>
    );
  } else {
    return (
      <React.Fragment>
        <p>Oops! An invalid view is being rendered to the screen...</p>
      </React.Fragment>
    );
  }
};

const mapStateToProps = (state) => {
  return {
    mainView: state.general.mainView,
  };
};

DynamicContainerComponent.propTypes = {
  mainView: PropTypes.oneOf(flattenObject(MAIN_VIEWS)),
  saveOwnUsername: PropTypes.func,
};

const mapDispatchToProps = (dispatch) => {
  return {
    saveOwnUsername: (username) => dispatch(
        generalAC.setOwnUsername(username)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(
    DynamicContainerComponent);
