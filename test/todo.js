const Todo = artifacts.require('./Todo.sol');

contract('Todo', () => {
  let meta;

  it('should add new item', () => {
    return Todo.deployed()
      .then((instance) => {
        meta = instance;

        return meta.addItem('Learn Solidity with Truffle');
      })
      .then(() => {
        return meta.items(1);
      })
      .then((item) => {
        assert.equal(item[0], 1, 'contains the correct id');
        assert.equal(item[1], 'Learn Solidity with Truffle', 'contains the correct description');
        assert.equal(item[2], false, 'contains the correct status');
      });
  });

  it('should toggle the status', () => {
    return Todo.deployed()
      .then((instance) => {
        meta = instance;

        return meta.addItem('Learn Solidity with Truffle');
      })
      .then(() => {
        return meta.markAs(1, true);
      })
      .then(() => {
        return meta.items(1);
      })
      .then((item) => {
        assert.equal(item[2], true, 'contains true');
      });
  });

  it('should delete item', () => {
    return Todo.deployed()
      .then((instance) => {
        meta = instance;

        return meta.addItem('Learn Solidity with Truffle');
      })
      .then(() => {
        return meta.destroy(1);
      })
      .then(() => {
        return meta.items(1);
      })
      .then((item) => {
        assert.equal(item[1], '', 'contains empty string');
      });
  });
});
