const TodoContract = {
  web3Provider: null,
  contracts: {},

  init() {
    return TodoContract.initWeb3();
  },

  initWeb3() {
    // Is there is an injected web3 instance?
    if (typeof web3 !== 'undefined') {
      this.web3Provider = web3.currentProvider;
      web3 = new Web3(web3.currentProvider);
    } else {
      // If no injected web3 instance is detected, fallback to Ganache.
      this.web3Provider = new web3.providers.HttpProvider('http://127.0.0.1:7545');
      web3 = new Web3(this.web3Provider);
    }

    return this.initContract();
  },

  initContract() {
    axios.get('Todo.json').then((response) => {
      // Get the necessary contract artifact file and instantiate it with truffle-contract
      const TodoArtifact = response.data;
      this.contracts.Todo = TruffleContract(TodoArtifact);

      // Set the provider for our contract
      this.contracts.Todo.setProvider(this.web3Provider);

      // Use our contract to retrieve todos
      return this.getItems();
    });
  },

  getItems() {
    let todoInstance;

    this.contracts.Todo.deployed().then((instance) => {
      todoInstance = instance;

      return todoInstance.itemCount();
    }).then((itemCount) => {
      for (let i = 1; i <= itemCount; i++) {
        todoInstance.items(i).then((item) => {
          if (item[1]) {
            app.items.push({
              id: item[0],
              description: item[1],
              markAs: item[2],
            });
          }
        });
      }
    }).catch((err) => {
      console.log(err.message);
    });
  },

  addItem(description) {
    this.contracts.Todo.deployed()
      .then(instance => instance.addItem(description));
  },

  markAs(id) {
    this.contracts.Todo.deployed()
      .then(instance => instance.markAs(id, true));
  },

  destroy(id) {
    this.contracts.Todo.deployed()
      .then(instance => instance.destroy(id));
  },
};

let app = new Vue({
  el: '#app',
  data: {
    items: [],
    newTodo: '',
    visibility: 'all',
  },
  created() {
    TodoContract.init();
  },
  computed: {
    getRemaining() {
      return this.items.filter(item => item.markAs === false).length;
    },
    filtedItems() {
      switch (this.visibility) {
        case 'active':
          return this.items.filter(item => item.markAs === false);

        case 'completed':
          return this.items.filter(item => item.markAs === true);

        default:
          return this.items;
      }
    },
  },
  methods: {
    addItem() {
      TodoContract.addItem(this.newTodo);
    },
    markAs(id) {
      TodoContract.markAs(id);
    },
    destroy(id) {
      TodoContract.destroy(id);
    },
    filterBy(status) {
      this.visibility = status;
    },
  },
});
