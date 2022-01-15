(() => {
    const app = {
      init () {
        moment.locale('nl-be');

        this.tinderApi = new TinderApi();

        this.users = null;

        this.fetchUsers();

        this.cacheElements();
      },
      cacheElements () {
        this.$usersList = document.querySelector('#users_list');
      },
      async fetchUsers () {
        this.users = await this.tinderApi.getUsers();
        this.$usersList.innerHTML = this.users.map(user => `
        <li data-id="${user.id}">
          <a href="">${user.username}</a>
        </li>
        `).join('');
      },
    }
    app.init();
})();