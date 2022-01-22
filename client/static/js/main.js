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
        this.matches = null;
        this.noMatches = null;

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
        this.$conversationImage = document.querySelector('#conversation_image');
        this.$conversation_chat = document.querySelector('#conversation_chat');
        this.$add_message = document.querySelector('#add_message')        
        this.$noMatchesList = document.querySelector('#no_matches_list');
        this.$matchesList = document.querySelector('#matches_list');
      },
      registerListeners () {
        this.$usersList.addEventListener('click', ev => {
          const userId = ev.target.dataset.user_id || ev.target.parentNode.dataset.user_id || ev.target.parentNode.parentNode.dataset.user_id || ev.target.parentNode.parentNode.parentNode.dataset.user_id;
          this.setActiveUser(userId);
        });
        this.$inboxList.addEventListener('click', ev => {
          const messageId = ev.target.dataset.msg_id || ev.target.parentNode.dataset.msg_id || ev.target.parentNode.parentNode.dataset.msg_id || ev.target.parentNode.parentNode.parentNode.dataset.msg_id;
          this.setConversationBetweenUsers(messageId);
        });
        this.$outboxList.addEventListener('click', ev => {
          const messageId = ev.target.dataset.msg_id || ev.target.parentNode.dataset.msg_id || ev.target.parentNode.parentNode.dataset.msg_id || ev.target.parentNode.parentNode.parentNode.dataset.msg_id;
          this.setConversationBetweenUsers(messageId);
        });
        this.$add_message.addEventListener('submit', async (ev) => {
          ev.preventDefault();
          const messageToCreate = {
            senderId: this.currentUserId,
            receiverId: this.friendId,
            message: ev.target['new_message'].value,
          }
          const createdMessage = await this.tinderApi.addMessageBetweenUsers(messageToCreate);
          ev.target['new_message'].value='';
          // Update the outbox for the active user
          this.sentMessages = await this.tinderApi.getSentMessagesFromUser(this.currentUserId);
          this.setOutbox(this.sentMessages);
          this.$outboxList.scrollTop = 0;
          // Update the conversation
          this.setConversationBetweenUsers(createdMessage.id);
        });
        this.$noMatchesList.addEventListener('click', async ev => {
          if (ev.target.dataset.type_rating) {
            const matchToCreate = {
              userId: this.currentUserId,
              friendId: ev.target.parentNode.parentNode.dataset.match_id,
              rating: ev.target.dataset.type_rating,
            }
            await this.tinderApi.addMatch(matchToCreate);
            // Update the no-matches for the active user
            this.matches = await this.tinderApi.getMatchesForUser(this.currentUserId);
            this.setMatches(this.matches);
            // Update the matches for the active user
            this.noMatches = this.users.filter(user => !this.matches.find(match => match.userId === user.id || match.friendId === user.id));
            this.setNoMatches(this.noMatches);
          }
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
              <span>${user.firstName} ${user.lastName}</span>
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
        this.setInbox(this.receivedMessages);
        // Fetch the sent messages for the active user
        this.sentMessages = await this.tinderApi.getSentMessagesFromUser(userId);
        // Load all sent messages from the user in the app
        this.setOutbox(this.sentMessages);
        // Get The most recent message of the active user
        if (this.receivedMessages[0].createdAt >= this.sentMessages[0].createdAt) {
          this.setConversationBetweenUsers(this.receivedMessages[0].id);
        } else {
          this.setConversationBetweenUsers(this.sentMessages[0].id);
        }
        this.matches = await this.tinderApi.getMatchesForUser(userId);
        this.setMatches(this.matches);
        this.noMatches = this.users.filter(user => !this.matches.find(match => match.userId === user.id || match.friendId === user.id));
        this.setNoMatches(this.noMatches);
      },
      async setInbox (receivedMessages) {
        let senderIds = [];
        let messages = [];
        for (msg of receivedMessages) {
          if (!senderIds?.includes(msg.senderId)) {
            messages.push(msg);
            senderIds.push(msg.senderId);
          }
        }
        this.$inboxList.innerHTML = messages.map(msg => `
        <li data-msg_id="${msg.id}">
          <a href="#">
            <section>
              <p>${this.users.find(user => user.id === msg.senderId).firstName} ${this.users.find(user => user.id === msg.senderId).lastName}</p>
              <p>${moment(msg.createdAt).fromNow()}</p>
            </section>
            <p>${msg.message}<p>
          </a>
        </li>
        `).join('');
      },
      async setOutbox (sentMessages) {
        let receiverIds = [];
        let messages = [];
        for (msg of sentMessages) {
          if (!receiverIds?.includes(msg.receiverId)) {
            messages.push(msg);
            receiverIds.push(msg.receiverId);
          }
        }
        this.$outboxList.innerHTML = messages.map(msg => `
        <li data-msg_id="${msg.id}">
          <a href="#">
          <section>
          <p>${this.users.find(user => user.id === msg.receiverId).firstName} ${this.users.find(user => user.id === msg.receiverId).lastName}</p>
          <p>${moment(msg.createdAt).fromNow()}</p>
        </section>
            <p>${msg.message}<p>
          </a>
        </li>
        `).join('');
      },
      async setConversationBetweenUsers (messageId) {
        // Determine the friendId based on the messageId
        if (this.receivedMessages.find(m => m.id === messageId)){
          this.friendId = this.receivedMessages.find(m => m.id === messageId).senderId;
        } else {
          this.friendId = this.sentMessages.find(m => m.id === messageId).receiverId;
        }
        // Set the friend's picture
        this.$conversationImage.src = this.users.find(user => user.id === this.friendId).picture.thumbnail;
        // Fetch the conversation between two users
        this.conversation = await this.tinderApi.getConversationBetweenUsers(this.currentUserId, this.friendId);
        // Load all messages between two users in the app
        this.$conversation_chat.innerHTML = this.conversation.map(msg => `
        <li data-chat-msg_id="${msg.id}" class="${msg.senderId === this.currentUserId ? "userMessage" : "friendMessage"}">
            <p>${msg.message}<p>
        </li>
        `).join('');
      },
      async setNoMatches (noMatches) {
        this.$noMatchesList.innerHTML = noMatches.map(noMatch => `
        <li data-match_id="${noMatch.id}">
            <section>
              <img src="${noMatch.picture.thumbnail}"/>
              <div>
                <span>${noMatch.firstName} ${noMatch.lastName}</span>
                <span>${moment(noMatch.dayOfBirth).fromNow(true)}</span>
              </div>
            </section>
            <section>
              <img src="static/media/icons/like.svg" data-type_rating="like" alt="like icon"/>
              <img src="static/media/icons/superlike.svg" data-type_rating="superlike" alt="superlike icon"/>
              <img src="static/media/icons/dislike.svg" data-type_rating="dislike" alt="dislike icon"/>
            </section>
        </li>
        `).join('');
      },
      async setMatches (matches) {
        this.$matchesList.innerHTML = matches.map(match => `
        <li data-match_id="${match.userId === this.currentUserId ? match.friendId : match.userId}">
            <span>${match.userId === this.currentUserId ? this.users.find(user => user.id === match.friendId).firstName : this.users.find(user => user.id === match.userId).firstName} ${match.userId === this.currentUserId ? this.users.find(user => user.id === match.friendId).lastName : this.users.find(user => user.id === match.userId).lastName}</span>
            <section>
              <img src="static/media/icons/${match.rating === "like" ? "liked" : "like"}.svg" data-type_rating="like" alt="${match.rating === "like" ? "liked" : "like"} icon"/>
              <img src="static/media/icons/${match.rating === "superlike" ? "superliked" : "superlike"}.svg" data-type_rating="superlike" alt="${match.rating === "superlike" ? "superliked" : "superlike"} icon"/>
              <img src="static/media/icons/${match.rating === "dislike" ? "disliked" : "dislike"}.svg" data-type_rating="dislike" alt="${match.rating === "dislike" ? "disliked" : "dislike"} icon"/>
            </section>
        </li>
        `).join('');
      },
    }
    app.init();
})();