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
        // Add event listeners
        this.registerListeners();
        // Run functions
        this.fetchUsers();
      },
      cacheElements () {
        this.$usersList = document.querySelector('#users_list');
        this.$inboxList = document.querySelector('#inbox_list');
        this.$outboxList = document.querySelector('#outbox_list');
        this.$conversation_chat = document.querySelector('#conversation_chat');
      },
      registerListeners () {
        this.$usersList.addEventListener('click', ev => {
          const userId = ev.target.dataset.user_id || ev.target.parentNode.dataset.user_id || ev.target.parentNode.parentNode.dataset.user_id || ev.target.parentNode.parentNode.parentNode.dataset.user_id;
          this.setActiveUser(userId);
        });
        this.$inboxList.addEventListener('click', ev => {
          const messageId = ev.target.dataset.msg_id || ev.target.parentNode.dataset.msg_id || ev.target.parentNode.parentNode.dataset.msg_id || ev.target.parentNode.parentNode.parentNode.dataset.msg_id;
          this.getConversationBetweenUsers(messageId);
        });
        this.$outboxList.addEventListener('click', ev => {
          const messageId = ev.target.dataset.msg_id || ev.target.parentNode.dataset.msg_id || ev.target.parentNode.parentNode.dataset.msg_id || ev.target.parentNode.parentNode.parentNode.dataset.msg_id;
          this.getConversationBetweenUsers(messageId);
        });
      },
      async fetchUsers () {
        // Fetch the users using the Api
        this.users = await this.tinderApi.getUsers();
        
        // Load all users in the app
        this.$usersList.innerHTML = this.users.map(user => `
        <li data-user_id="${user.id}">
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
        // Remove the highlight of the previous active user
        const $selectedUser = this.$usersList.querySelector('.selected');
        if ($selectedUser) {
          $selectedUser.classList.remove('selected');
        }       
        // Highlight the active user in the users list
        this.$usersList.querySelector(`li[data-user_id="${userId}"]`).classList.add('selected');
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
          this.getConversationBetweenUsers(this.receivedMessages[0].id);
        } else {
          this.getConversationBetweenUsers(this.sentMessages[0].id);
        }        
      },
      async setInbox (receivedMessages) {
        this.$inboxList.innerHTML = receivedMessages.map(msg => `
        <li data-msg_id="${msg.id}">
          <a href="#">
            <span>${msg.senderId}</span>
            <p>${msg.message}<p>
          </a>
        </li>
        `).join('');
      },
      async setOutbox (sentMessages) {
        this.$outboxList.innerHTML = sentMessages.map(msg => `
        <li data-msg_id="${msg.id}">
          <a href="#">
            <span>${msg.receiverId}</span>
            <p>${msg.message}<p>
          </a>
        </li>
        `).join('');
      },
      async getConversationBetweenUsers (messageId) {
        // Determine the friendId based on the messgeId
        if (this.receivedMessages.filter(m => m.id === messageId).length > 0){
          this.friendId = this.receivedMessages.filter(m => m.id === messageId)[0].senderId;
        } else {
          this.friendId = this.sentMessages.filter(m => m.id === messageId)[0].receiverId;
        }
        // Fetch the conversation between two users
        this.conversation = await this.tinderApi.getConversationBetweenUsers(this.currentUserId, this.friendId);
        // Load all messages between two users in the app
        this.setChat (this.conversation);
      },
      async setChat (conversation) {
        this.$conversation_chat.innerHTML = conversation.map(msg => `
        <li data-chat-msg_id="${msg.id}">
          <a href="#">
            <span>${msg.message}<span>
          </a>
        </li>
        `).join('');
      },
    }
    app.init();
})();