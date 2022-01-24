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

  // Add a message between two users
  this.addMessageBetweenUsers = async (message) => {
    try {
      const response = await fetch(`${TINDER_BASE_PATH}/messages`, {
        method: 'POST',
        mode: 'cors',
        headers: {
          "Content-Type": "Application/Json"
        },
        body: JSON.stringify(message),
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.log('An error occured!', error);
    }
  };

  // Get all matches for a specific user
  this.getMatchesForUser = async (userId) => {
    try {
      const response = await fetch(`${TINDER_BASE_PATH}/users/${userId}/matches`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.log('An error occured!', error);
    }
  };

  // Create a match between two users
  this.addMatch = async (match) => {
    try {
      const response = await fetch(`${TINDER_BASE_PATH}/matches`, {
        method: 'POST',
        mode: 'cors',
        headers: {
          "Content-Type": "Application/Json"
        },
        body: JSON.stringify(match),
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.log('An error occured!', error);
    }
  };
}