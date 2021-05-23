import React, {useEffect, useState} from 'react';
import SockJsClient from 'react-stomp';
import PropTypes from 'prop-types';
import apiEndpoints from './apiEndpoints';

/**
 * This wrapper component should be leveraged whenever there is a need for a
 * real-time websocket-based connection to back-end.
 *
 * This basically means whenever you want to listen for server-side events
 * on the client-side, such as when players make moves or the status of the
 * game changes for any reason. There will be the appropriate topic for
 * listening to the right thing.
 *
 * All the developer needs to do is provide the names of the topic(s) and the
 * callback function which should handle incoming messages from that topic.
 *
 * @param {Object} props the topics to listen on and accompanying callback func
 * @return {JSX} to render
 */
const AbstractedWebsocket = (props) => {
  const [processedTopics, setProcessedTopics] = useState([]);

  useEffect(() => {
    const processedTopics =
        props.topics.map((topic) => (topic = '/subscribe' + topic));
    setProcessedTopics(processedTopics);
  }, [props.topics]);

  return (
    <React.Fragment>
      <SockJsClient url={apiEndpoints.websocketPath} topics={processedTopics}
        onMessage={(msg) => props.onReceiveMessage(msg)}/>
    </React.Fragment>
  );
};

AbstractedWebsocket.propTypes = {
  topics: PropTypes.arrayOf(PropTypes.string),
  onReceiveMessage: PropTypes.func,
};

export default AbstractedWebsocket;
