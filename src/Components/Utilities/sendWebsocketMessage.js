/**
 * This utility function should be used to send websocket messages, alongside
 * the AbstractedWebsocket Component.
 *
 * @param {Ref} websocket This should be a reference to the
 * AbstractedWebsocket component. To get this reference, add
 * `ref={websocket}` to that component.
 *
 * In addition to that, "websocket" should be declared in the component which is
 * calling this utility function. It should be managed with the useRef Hook:
 * `const websocket = useRef(null);`
 *
 * The variable is not required to be named "websocket" exactly. The above is
 * just an example of the appropriate usage.
 * @param {String} topic A String path to the websocket topic to which this
 * message should be published.
 * @param {Object} data Any JavaScript Object which is the data to publish
 */
const sendWebsocketMessage = (websocket, topic, data) => {
  try {
    websocket.current.sendMessage('/publish' + topic, JSON.stringify(data));
  } catch (error) {
    console.warn('Error trying to send websocket message to ' + topic);
    console.warn(error);
  }
};

export default sendWebsocketMessage;
