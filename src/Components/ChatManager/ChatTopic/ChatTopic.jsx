import React from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {
  MainContainer,
  ChatContainer,
  MessageList,
  Message,
  MessageInput,
  Avatar,
} from '@chatscope/chat-ui-kit-react';
import axios from 'axios';
import apiEndpoints from '../../Utilities/apiEndpoints';
import CHAT_TOPIC from '../../Utilities/chatTopics';
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import './ChatTopic.css';

/**
 *
 * ChatTopic JSDocs
 *
 * @param {Object} props passed from the parent component
 * @return {JSX} to render
 */
const ChatTopic = (props) => {
  const sendMessage = (chatMessageToSend) => {
    let id = '';
    let chatTopic = 'INVALID';
    switch (props.selectedChatTopic) {
      case CHAT_TOPIC.GLOBAL:
        chatTopic = 'GLOBAL';
        id = 'global';
        break;
      case CHAT_TOPIC.LOBBY:
        chatTopic = 'LOBBY';
        id = props.lobbyId;
        break;
      case CHAT_TOPIC.GAME:
        chatTopic = 'GAME';
        id = props.gameId;
        break;
    }
    if (chatTopic === 'INVALID') {
      console.warn('Can\'t send message to ' + props.selectedChatTopic);
      return;
    }
    try {
      const request = {
        id: id,
        sender: props.ownUserId,
        message: chatMessageToSend,
        chatTopic: chatTopic,
      };
      axios.post(apiEndpoints.chatController + '/message',
          request);
    } catch (e) {
      console.warn('Oops! There was an error trying to send a chat message!');
      console.warn(e);
    }
  };

  return (
    <React.Fragment>
      <div className='chat-tab-container'>
        <MainContainer>
          <ChatContainer>
            <MessageList>
              {props.messages && props.messages.length > 0 ?
              props.messages.map((messageData, index) => (
                <Message
                  key={messageData.sender + index}
                  model={messageData}>
                  <Message.Header sender={messageData.sender}/>
                  <Avatar src={'GUEST_AVATAR.svg'}
                    name={messageData.sender}/>
                </Message>
              )) : null}
            </MessageList>
            <MessageInput
              attachButton={false}
              onSend={sendMessage}
              placeholder="Type message here"/>
          </ChatContainer>
        </MainContainer>
      </div>
    </React.Fragment>
  );
};

const getMessagesFromState = (state) => {
  switch (state.chat.selectedChatTopic) {
    case CHAT_TOPIC.GLOBAL:
      return state.chat.globalMessages;
    case CHAT_TOPIC.LOBBY:
      return state.chat.lobbyMessages;
    case CHAT_TOPIC.GAME:
      return state.chat.gameMessages;
    default:
      return [];
  }
};

const mapStateToProps = (state) => {
  return {
    messages: getMessagesFromState(state),
    gameId: state.game.gameId,
    lobbyId: state.lobby.lobbyId,
    ownUserId: state.general.ownUserId,
    selectedChatTopic: state.chat.selectedChatTopic,
  };
};

ChatTopic.propTypes = {
  messages: PropTypes.array,
  gameId: PropTypes.string,
  lobbyId: PropTypes.string,
  ownUserId: PropTypes.string,
  selectedChatTopic: PropTypes.string,
};

export default connect(mapStateToProps)(ChatTopic);
