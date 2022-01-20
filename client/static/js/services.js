const TINDER_BASE_PATH = 'http://localhost:4040/api';

function TinderApi () {
  // Get all users
  this.getUsers = async () => { 
    try {
      const response = await fetch(`${TINDER_BASE_PATH}/users`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.log('An error occured!', error);
    }
  };

  // Get a specific user
  this.getUserById = async (userId) => { 
    try {
      const response = await fetch(`${TINDER_BASE_PATH}/users/:${userId}`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.log('An error occured!', error);
    }
  };

  // Get all received messages from a specific user
  this.getReceivedMessagesFromUser = async (userId) => {
    try {
      const response = await fetch(`${TINDER_BASE_PATH}/users/${userId}/messages?type=received`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.log('An error occured!', error);
    }
  };

  // Get all sent messages from a specific user
  this.getSentMessagesFromUser = async (userId) => {
    try {
      const response = await fetch(`${TINDER_BASE_PATH}/users/${userId}/messages?type=sent`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.log('An error occured!', error);
    }
  };

  // Get all messages between two users
  this.getConversationBetweenUsers = async (userId, friendId) => {
    try {
      const response = await fetch(`${TINDER_BASE_PATH}/users/${userId}/messages?type=conversation&friendId=${friendId}`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.log('An error occured!', error);
    }
  };

  this.addMessageBetweenUsers = async (userId, friendId, message) => {
  };

  this.getMatchesForUser = async (userId) => {
  };

  this.addMatch = async (userId, friendId, rating) => {
  };
}