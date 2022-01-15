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

        // Cache all elements
        this.cacheElements();
        // Run functions
        this.fetchUsers();
      },
      cacheElements () {
        this.$usersList = document.querySelector('#users_list');
        this.$inboxList = document.querySelector('#inbox_list');
        this.$outboxList = document.querySelector('#outbox_list');
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
        this.$inboxList.innerHTML = this.receivedMessages.map(msg => `
        <li data-id="${msg.id}">
          <a href="#">
            <span>${msg.message}<span>
          </a>
        </li>
        `).join('');
        // Fetch the sent messages for the active user
        this.sentMessages = await this.tinderApi.getSentMessagesFromUser(userId);
        this.$outboxList.innerHTML = this.sentMessages.map(msg => `
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