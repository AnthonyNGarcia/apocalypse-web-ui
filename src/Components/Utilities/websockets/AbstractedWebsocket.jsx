import React, {forwardRef} from 'react';
import SockJsClient from 'react-stomp';
import PropTypes from 'prop-types';
import apiEndpoints from '../apiEndpoints';

/**
 * This wrapper component should be leveraged whenever there is a need for a
 * real-time websocket-based connection for multiplayer/live data.
 *
 * Examples include when players type in chat, move armies, or the status of the
 * game otherwise changes for any reason. These events are organized via topics.
 *
 * What the developer needs to do is provide the names of the topic(s) and the
 * callback function which should handle incoming messages from that topic(s) as
 * props to this component.
 *
 * Additionally, the developer should use  the sendWebsocketMessage.js utility
 * function for sending websocket messages (not handled here). However, that
 * utility does require the presence of this component, and with one more thing:
 * `ref={websocket}` being one of the properties of this component. The parent
 * component to this would accordingly need to declare and manage that variable
 * as such: `const websocket = useRef(null)`.
 *
 * @param {Object} props the topics to listen on and accompanying callback func
 * @return {JSX} to render
 */
const AbstractedWebsocket = forwardRef((props, ref) => {
  return (
    <React.Fragment>
      <SockJsClient
        ref={ref}
        url={apiEndpoints.websocketPath}
        topics={props.topics}
        debug={true}
        autoReconnect={true}
        onMessage={(msg, topic) => props.onReceiveMessage(msg, topic)}
        onDisconnect={props.onDisconnect ? props.onDisconnect : ()=>{}}
        getRetryInterval={(count) => 500 * count}/>
    </React.Fragment>
  );
});

AbstractedWebsocket.displayName = 'AbstractedWebsocket-to-SockJSClient';

AbstractedWebsocket.propTypes = {
  topics: PropTypes.arrayOf(PropTypes.string).isRequired,
  onReceiveMessage: PropTypes.func.isRequired,
  onDisconnect: PropTypes.func,
};

export default AbstractedWebsocket;
