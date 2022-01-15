(() => {
    const app = {
      init () {
        moment.locale('nl-be');

        // Create a TinderApi
        this.tinderApi = new TinderApi();

        // Predefine variables
        this.users = null;
        this.currentUserId = null;
        this.receivedMessages = null;
        this.sentMessages = null;
        this.conversation = null;
        this.friendId = null;

        // Cache all elements
        this.cacheElements();
        // Run functions
        this.fetchUsers();
      },
      cacheElements () {
        this.$usersList = document.querySelector('#users_list');
        this.$inboxList = document.querySelector('#inbox_list');
        this.$outboxList = document.querySelector('#outbox_list');
        this.$conversation_chat = document.querySelector('#conversation_chat');
      },
      async fetchUsers () {
        // Fetch the users using the Api
        this.users = await this.tinderApi.getUsers();
        // Load all users in the app
        this.$usersList.innerHTML = this.users.map(user => `
        <li data-id="${user.id}">
          <a href="#">
            <section>
              <img src="${user.picture.thumbnail}" />
              <span>${user.username}</span>
            </section>
          </a>
        </li>
        `).join('');
        // Make the first user the active user by default
        const userId = this.users[0].id;
        this.setActiveUser(userId);
      },
      async setActiveUser (userId) {
        // Set the active user
        this.currentUserId = userId;
        // Fetch the received messages for the active user
        this.receivedMessages = await this.tinderApi.getReceivedMessagesFromUser(userId);
        // Load all received messages from the user in the app
        this.setInbox (this.receivedMessages);
        // Fetch the sent messages for the active user
        this.sentMessages = await this.tinderApi.getSentMessagesFromUser(userId);
        // Load all sent messages from the user in the app
        this.setOutbox (this.sentMessages);
        // Get The most recent message of the active user and get friendId
        if (this.receivedMessages[0].createdAt >= this.sentMessages[0].createdAt) {
          friendId = this.receivedMessages[0].senderId;
        } else {
          friendId = this.sentMessages[0].receiverId;
        }        
        // Fetch the most recent conversation for the active user
        this.conversation = await this.tinderApi.getConversationBetweenUsers(userId, friendId);
        // Load all sent messages from the user in the app
        this.setChat (this.conversation);
      },
      async setInbox (receivedMessages) {
        this.$inboxList.innerHTML = receivedMessages.map(msg => `
        <li data-id="${msg.id}">
          <a href="#">
            <span>${msg.message}<span>
          </a>
        </li>
        `).join('');
      },
      async setOutbox (sentMessages) {
        this.$outboxList.innerHTML = sentMessages.map(msg => `
        <li data-id="${msg.id}">
          <a href="#">
            <span>${msg.message}<span>
          </a>
        </li>
        `).join('');
      },
      async setChat (conversation) {
        this.$conversation_chat.innerHTML = conversation.map(msg => `
        <li data-id="${msg.id}">
          <a href="#">
            <span>${msg.message}<span>
          </a>
        </li>
        `).join('');
      },
    }
    app.init();
})();