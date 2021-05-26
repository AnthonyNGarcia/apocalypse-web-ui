import React, {useEffect, useState} from 'react';
import axios from 'axios';
import './BrowseLobbies.css';
import apiEndpoints from '../../Utilities/apiEndpoints';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';

/**
 *
 * BrowseLobbies JSDocs
 *
 * @param {Object} props passed from the parent component
 * @return {JSX} to render
 */
const BrowseLobbies = (props) => {
  const [currentLobbies, setCurrentLobbies] = useState([]);

  useEffect(async () => {
    const fetchCurrentLobbies = async () => {
      const serverResponse = await
      axios.get(apiEndpoints.lobbyController + '/in-memory');
      console.log(serverResponse);
      console.log(serverResponse.data);
      return serverResponse.data;
    };

    setCurrentLobbies(await fetchCurrentLobbies());
  }, []);

  return (
    <React.Fragment>
      <h3>Browsing Lobbies Component</h3>
      <Container>
        {currentLobbies.length > 0 ? currentLobbies.map((lobby) =>
          <Row key={lobby.lobbyId}>
            <p>{lobby.playerOneUsername + '\'s Lobby'}</p>
          </Row>) : <p>No lobbies available to join. Try creating one!</p>}
      </Container>
    </React.Fragment>
  );
};

export default BrowseLobbies;
