/* GAME
    const navigateToBattleMap = async (battleData) => {
    await props.saveBattleData(battleData);
    await props.updateShowEnemyArmyInBattle(false);
    await props.updateOwnArmySubmitted(false);
    props.updateGameView(GAME_VIEWS.BATTLE_MAP_VIEW);
  };

  const handleConfigurationsComplete = async (battleData) => {
    await props.saveBattleData(battleData);
    props.updateShowEnemyArmyInBattle(true);
  };

  const navigateToCampaignMap = async (battleResults) => {
    const gameBoardWithArmiesUpdated = await JSON.parse(
        JSON.stringify(props.gameBoard));
    gameBoardWithArmiesUpdated[battleResults.attackingArmyStartingTilePosition]
        .army = null;
    gameBoardWithArmiesUpdated[battleResults.defendingArmyStartingTilePosition]
        .army = null;
    gameBoardWithArmiesUpdated[battleResults.attackingArmyEndingTilePosition]
        .army = battleResults.attackingArmy;
    gameBoardWithArmiesUpdated[battleResults.defendingArmyEndingTilePosition]
        .army = battleResults.defendingArmy;
    await props.updateGameBoard(gameBoardWithArmiesUpdated);
    await props.updateGameView(GAME_VIEWS.CAMPAIGN_MAP_VIEW);
  };

*/

/* IN LOBBY
  const saveFactionGameData = (playerData) => {
    switch (playerData.factionType) {
      case FACTIONS.HUMANS.NAME:
        props.saveActionBarData(FACTIONS.HUMANS.ACTION_BAR_DATA);
        break;
      case FACTIONS.INSECTS.NAME:
        props.saveActionBarData(FACTIONS.INSECTS.ACTION_BAR_DATA);
        break;
      default:
        console.warn('Oops! An invalid faction was parsed!');
    }
  };

  const navigateToInGame = (gameData) => {
    console.log(gameData);
    const initialGameData = gameData.initialGameData;
    const gameConstants = gameData.gameConstantsDTO;
    props.saveGameId(initialGameData.gameId);
    props.saveGameBoard(initialGameData.gameBoard);
    props.savePlayerOne(initialGameData.playerOne);
    props.savePlayerTwo(initialGameData.playerTwo);
    if (initialGameData.playerOne.username === props.ownUsername) {
      saveFactionGameData(initialGameData.playerOne);
      props.saveOwnPlayerNumber(PLAYER.ONE);
    } else {
      saveFactionGameData(initialGameData.playerTwo);
      props.saveOwnPlayerNumber(PLAYER.TWO);
    }
    props.updatePlayerWhoseTurnItIs(
        initialGameData.playerWhoseTurnItIs);
    props.saveGameConstants(gameConstants);
    props.updateMainViewToGame();
  };


  const navigateToBrowseLobbies = () => {
    props.savePlayerOneUsername(null);
    props.savePlayerTwoUsername(null);
    props.saveLobbyId(null);
    props.updateLobbyViewToBrowseLobbies();
  };

    const onReceiveMessage = (message) => {
    console.log(message);
    const playerOneUsername = message.body.playerOneUsername;
    if (!playerOneUsername) {
      navigateToBrowseLobbies();
    }
    const playerTwoUsername = message.body.playerTwoUsername;
    if (playerTwoUsername !== props.playerTwoUsername) {
      if (props.ownUsername === props.playerTwoUsername) {
        navigateToBrowseLobbies();
      } else {
        props.savePlayerTwoUsername(playerTwoUsername);
      }
    }

    if (message.body.initialGameData) {
      lobbyCleanup();
      navigateToInGame(message.body);
    }
  };
  */

/* GAME BOARD
  const resetPlayerView = () => {
    props.unshowCityModal();
    props.updateMainPanelView(MAIN_PANEL_VIEWS.NONE);
    props.updateMainPanelData({});
    props.updateCityMenuSupplementalData({});
    props.updateCityMenuSupplementalView(CITY_MENU_SUPPLEMENTAL_VIEWS.NONE);
  };

  const logUnexpectedWebsocketMessage = (message) => {
    console.warn('Client received an unexpected websocket message.');
    console.warn('---Unexpected message start---');
    console.warn(message);
    console.warn('---Unexpected message end---');
  };
const onReceiveMessage = async (message) => {
    props.updateAwaitingServerConfirmation(false);
    // No matter what, if the server gives us a game board,
    // we must accept it immediately, without modifications.
    if (await message.body.gameBoard) {
      await props.updateGameBoard(message.body.gameBoard);
    }
    // Let's identify what kind of message this is, to handle it properly
    if (message.body.messageType) {
      switch (message.body.messageType) {
        case WEBSOCKET_MESSAGE_TYPES.PLAYER_ENDED_TURN:
          resetPlayerView();
          await props.updatePlayerOne(message.body.playerOne);
          await props.updatePlayerTwo(message.body.playerTwo);
          await props.updatePlayerWhoseTurnItIs(
              message.body.playerWhoseTurnItIs);
          break;
        case WEBSOCKET_MESSAGE_TYPES.ARMY_MOVED_UNCONTESTED:
          const gameBoardWithArmyMoved = await JSON.parse(
              JSON.stringify(props.gameBoard));
          gameBoardWithArmyMoved[message.body.endingTilePosition].army =
            message.body.army;
          gameBoardWithArmyMoved[message.body.startingTilePosition].army = null;
          await props.updateGameBoard(gameBoardWithArmyMoved);
          break;
        case WEBSOCKET_MESSAGE_TYPES.ARMY_STANCE_CHANGED:
          const gameBoardWithArmyStanceChanged = await JSON.parse(
              JSON.stringify(props.gameBoard));
          gameBoardWithArmyStanceChanged[message.body.tilePosition].army =
            message.body.army;
          await props.updateGameBoard(gameBoardWithArmyStanceChanged);
          break;
        case WEBSOCKET_MESSAGE_TYPES.UNIT_RECRUITMENT_QUEUE_UPDATED:
          const gameBoardWithRecruitmentQueueUpdated = await JSON.parse(
              JSON.stringify(props.gameBoard));
          gameBoardWithRecruitmentQueueUpdated[message.body.cityTilePosition]
              .city.currentRecruitmentQueue = message.body
                  .updatedUnitRecruitmentQueue;
          gameBoardWithRecruitmentQueueUpdated[message.body.cityTilePosition]
              .city.unitProductionRemaining = message.body
                  .updatedRemainingUnitProduction;
          await props.updateGameBoard(gameBoardWithRecruitmentQueueUpdated);
          break;
        case WEBSOCKET_MESSAGE_TYPES.ARMY_UNITS_UPDATED:
          const gameBoardWithArmyUnitsUpdated = await JSON.parse(
              JSON.stringify(props.gameBoard));
          gameBoardWithArmyUnitsUpdated[message.body.armyTilePosition]
              .army.units = message.body
                  .updatedArmyUnits;
          await props.updateGameBoard(gameBoardWithArmyUnitsUpdated);
          break;
        case WEBSOCKET_MESSAGE_TYPES.UNASSIGNED_UNITS_UPDATED:
          const gameBoardWithUnassignedUnitsUpdated = await JSON.parse(
              JSON.stringify(props.gameBoard));
          gameBoardWithUnassignedUnitsUpdated[message.body.cityTilePosition]
              .city.unassignedUnits = message.body
                  .updatedUnassignedUnits;
          await props.updateGameBoard(gameBoardWithUnassignedUnitsUpdated);
          break;
        case WEBSOCKET_MESSAGE_TYPES.ARMY_AND_UNASSIGNED_UNITS_UPDATED:
          const gameBoardWithArmyAndUnassignedUnitsUpdated = await JSON.parse(
              JSON.stringify(props.gameBoard));
          gameBoardWithArmyAndUnassignedUnitsUpdated[message.body.tilePosition]
              .city.unassignedUnits = message.body
                  .updatedUnassignedUnits;
          gameBoardWithArmyAndUnassignedUnitsUpdated[message.body.tilePosition]
              .army.units = message.body
                  .updatedArmyUnits;
          await props
              .updateGameBoard(gameBoardWithArmyAndUnassignedUnitsUpdated);
          break;
        default:
          logUnexpectedWebsocketMessage(message);
      }
    } else {
      logUnexpectedWebsocketMessage(message);
    }
  };
  */

/**
 * This all-purpose websocket message handler will sort incoming websocket
 * messages from the server and redirect them to more specific logic handlers
 * as necessary for functionality.
 *
 * @param {WebsocketMessage} message containing a WEBSOCKET_MESSAGE_TYPE
 */
const websocketMessageReceiver = (message) => {
  console.log(message);
  const messageType = message.messageType;
  console.log(messageType);
//   switch (messageType) {
//     case WEBSOCKET_MESSAGE_TYPES.PLAYER_LEFT_GAME:
//       const playerUsername = message.leavingPlayerUsername;
//       console.log('Player ' + playerUsername + ' has left! Closing game...');
//       gameCleanup();
//       navigateToBrowseLobbies();
//       break;
//     case WEBSOCKET_MESSAGE_TYPES.BATTLE_STARTED:
//       console.log('A battle has started! Changing to battle view...');
//       console.log(message);
//       navigateToBattleMap(message.battleData);
//       break;
//     case WEBSOCKET_MESSAGE_TYPES.BATTLE_ENDED:
//       console.log('A battle has ended! Changing to campaign view...');
//       console.log(message);
//       navigateToCampaignMap(message);
//       break;
//     case WEBSOCKET_MESSAGE_TYPES.CONFIGURATION_COMPLETE:
//       console.log('Configuration complete! Revealing enemy army...');
//       console.log(message);
//       handleConfigurationsComplete(message.battleData);
//       break;
//     case WEBSOCKET_MESSAGE_TYPES.BATTLE_DATA_UPDATED:
//       console.log('Received updated battle data from server! ' +
//           'Updating local state...');
//       props.saveBattleData(message.battleData);
//       break;
//     default:
//       console.warn('Received unexpected websocket message for ' +
//           'the general Game component!');
//   }
};

export default websocketMessageReceiver;
