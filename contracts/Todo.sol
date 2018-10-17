pragma solidity ^0.4.24;

contract Todo {

    struct Item {
        uint id;
        string description;
        bool done;
    }

    mapping(uint => Item) public items;

    uint public itemCount;

    function addItem(string _description) public {
        itemCount++;
        items[itemCount] = Item(itemCount, _description, false);
    }

    function markAs(uint _id, bool _done) public {
        items[_id].done = _done;
    }
    
    function destroy(uint _id) public {
        delete items[_id]; 
    }
}
