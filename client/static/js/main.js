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
        this.$conversationPartner = document.querySelector('#conversation_partner');
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
            // Update the matches for the active user
            this.matches = await this.tinderApi.getMatchesForUser(this.currentUserId);
            this.setMatches(this.matches);
            // Update the no-matches for the active user
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
        <li data-msg_id="${msg.id}" data-msg_sender_id="${msg.senderId}">
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
        <li data-msg_id="${msg.id}" data-msg_receiver_id="${msg.receiverId}">
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
        // set the conversation partner's name
        this.$conversationPartner.innerText = `${this.users.find(user => user.id === this.friendId).firstName} ${this.users.find(user => user.id === this.friendId).lastName}`;
        // Set the conversation partner's picture
        this.$conversationImage.src = this.users.find(user => user.id === this.friendId).picture.thumbnail;
        // Remove the highlight of the previous selected messages
        const $selectedMessages = [... this.$inboxList.querySelectorAll('.selected'), ... this.$outboxList.querySelectorAll('.selected')];
        if ($selectedMessages.length > 0) {
          for (message of $selectedMessages) {
            message.classList.remove('selected');
          }
        }       
        // Highlight the messages received from the conversation partner in the inbox
        const $receivedMessages = this.$inboxList.querySelectorAll(`li[data-msg_sender_id="${this.friendId}"]`);
        if ($receivedMessages) {
          for (message of $receivedMessages) {
            message.classList.add('selected');
          }
        }
        // Highlight the messages sent to the conversation partner in the outbox
        const $sentMessages = this.$outboxList.querySelectorAll(`li[data-msg_receiver_id="${this.friendId}"]`);
        if ($sentMessages) {
          for (message of $sentMessages) {
            message.classList.add('selected');
          }
        }
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
                <span>${moment(noMatch.dayOfBirth).fromNow(true).slice(0,2)} jaar oud</span>
              </div>
            </section>
            <span><span>${noMatch.location.city}</span> - <span>${noMatch.location.country}</span></span>
            <section>
              <img src="static/media/icons/like.png" data-type_rating="like" alt="like icon"/>
              <img src="static/media/icons/superlike.png" data-type_rating="superlike" alt="superlike icon"/>
              <img src="static/media/icons/dislike.png" data-type_rating="dislike" alt="dislike icon"/>
            </section>
        </li>
        `).join('');
      },
      async setMatches (matches) {
        this.$matchesList.innerHTML = matches.map(match => `
        <li data-match_id="${match.userId === this.currentUserId ? match.friendId : match.userId}">
          <section>
            <img src="${match.userId === this.currentUserId ? this.users.find(user => user.id === match.friendId).picture.thumbnail : this.users.find(user => user.id === match.userId).picture.thumbnail}"/>
            <div>
              <span>${match.userId === this.currentUserId ? this.users.find(user => user.id === match.friendId).firstName : this.users.find(user => user.id === match.userId).firstName} ${match.userId === this.currentUserId ? this.users.find(user => user.id === match.friendId).lastName : this.users.find(user => user.id === match.userId).lastName}</span>
              <span>${match.userId === this.currentUserId ? moment(this.users.find(user => user.id === match.friendId).dayOfBirth).fromNow(true).slice(0,2) : moment(this.users.find(user => user.id === match.userId).dayOfBirth).fromNow(true).slice(0,2)} jaar oud</span>
            </div>
          </section>
          <span><span>${match.userId === this.currentUserId ? this.users.find(user => user.id === match.friendId).location.city : this.users.find(user => user.id === match.userId).location.city}</span> - <span>${match.userId === this.currentUserId ? this.users.find(user => user.id === match.friendId).location.country : this.users.find(user => user.id === match.userId).location.country}</span></span>
          <p>${match.userId === this.currentUserId ? 'You rated them with:' : '<span>They liked you,</span><span>like them back!</span>'}</p>
          <section>
            <img src="static/media/icons/like.png" ${match.userId === this.currentUserId && match.rating === "like" ? 'class="rated" ': ''}data-type_rating="like" alt="like icon"/>
            <img src="static/media/icons/superlike.png" ${match.userId === this.currentUserId && match.rating === "superlike" ? 'class="rated" ': ''}data-type_rating="superlike" alt="superlike icon"/>
            <img src="static/media/icons/dislike.png" ${match.userId === this.currentUserId && match.rating === "dislike" ? 'class="rated" ': ''}data-type_rating="dislike" alt="dislike icon"/>
          </section>        
        </li>
        `).join('');
      },
    }
    app.init();
})();