import React, {useEffect, useState} from 'react';
import {connect} from 'react-redux';
import ChatTopic from './ChatTopic/ChatTopic';
import PropTypes from 'prop-types';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Dropdown from 'react-bootstrap/Dropdown';
import CHAT_TOPIC from '../Utilities/chatTopics';
import chatAC from '../../Redux/actionCreators/chatActionCreators';
import './ChatManager.css';

/**
 *
 * ChatManager JSDocs
 *
 * @param {Object} props passed from the parent component
 * @return {JSX} to render
 */
const ChatManager = (props) => {
  const [chatTopics, setChatTopics] = useState([]);
  const [shrink, setShrink] = useState(false);

  const changeChatTopic = (e, chatTopicLabel) => {
    e.preventDefault();
    props.updateSelectedChatTopic(chatTopicLabel);
  };

  const shrinkChat = (e) => {
    e.preventDefault();
    setShrink(true);
  };

  const expandChat = (e) => {
    e.preventDefault();
    setShrink(false);
  };

  useEffect(() => {
    const newChatTopics = [
      {
        label: CHAT_TOPIC.GLOBAL,
        messages: props.globalMessages,
      },
    ];
    if (props.gameId) {
      newChatTopics.push(
          {
            label: CHAT_TOPIC.GAME,
            messages: props.gameMessages,
          },
      );
    }
    if (props.lobbyId) {
      newChatTopics.push(
          {
            label: CHAT_TOPIC.LOBBY,
            messages: props.lobbyMessages,
          },
      );
    }
    setChatTopics(newChatTopics);
  }, [props.gameId, props.lobbyId]);

  return (
    <React.Fragment>
      <div className={shrink ? 'shrunken-chat-manager-container' :
      'expanded-chat-manager-container'}>
        <Navbar bg="dark" variant="dark" className='chat-navbar'>
          <Navbar.Brand>Chat</Navbar.Brand>
          <Nav>
            {chatTopics && chatTopics.length > 0 ?
          chatTopics.map((chatTopic) => (
            <Nav.Link key={chatTopic.label}
              onClick={(e) => changeChatTopic(e, chatTopic.label)}
              href={chatTopic.label}>
              {chatTopic.label}
            </Nav.Link>
          )) : null}
          </Nav>
          <div className='chat-toggle-button'>
            {shrink ? (
            <Dropdown onClick={expandChat}
              drop={'up'}>
              <Dropdown.Toggle variant='secondary' id='expand-chat'>
              </Dropdown.Toggle>
            </Dropdown>
          ) : (
              <Dropdown onClick={shrinkChat}
                drop={'down'}>
                <Dropdown.Toggle variant='secondary' id='shrink-chat'>
                </Dropdown.Toggle>
              </Dropdown>
          )}
          </div>
        </Navbar>
        <ChatTopic/>
      </div>
    </React.Fragment>
  );
};

const mapStateToProps = (state) => {
  return {
    lobbyId: state.lobby.lobbyId,
    gameId: state.game.gameId,
    selectedChatTopic: state.chat.selectedChatTopic,
    globalMessages: state.chat.globalMessages,
    lobbyMessages: state.chat.lobbyMessages,
    gameMessages: state.chat.gameMessages,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    updateSelectedChatTopic: (selectedChatTopic) => dispatch(
        chatAC.setSelectedChatTopic(selectedChatTopic)),
  };
};

ChatManager.propTypes = {
  lobbyId: PropTypes.string,
  gameId: PropTypes.string,
  selectedChatTopic: PropTypes.string,
  globalMessages: PropTypes.array,
  lobbyMessages: PropTypes.array,
  gameMessages: PropTypes.array,
  updateSelectedChatTopic: PropTypes.func,
};

export default connect(mapStateToProps, mapDispatchToProps)(ChatManager);
