const TINDER_BASE_PATH = 'http://localhost:4040/api';

function TinderApi () {
  this.getUsers = async () => { 
    try {
      const response = await fetch(`${TINDER_BASE_PATH}/users`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.log('An error occured!', error);
    }
  };

  this.getReceivedMessagesFromUser = async (userId) => {
  };

  this.getSentMessagesFromUser = async (userId) => {
  };

  this.getConversationBetweenUsers = async (userId, friendId) => {
  };

  this.addMessageBetweenUsers = async (userId, friendId, message) => {
  };

  this.getMatchesForUser = async (userId) => {
  };

  this.addMatch = async (userId, friendId, rating) => {
  };
}