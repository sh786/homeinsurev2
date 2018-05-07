pragma solidity ^0.4.2;

contract SimpleStorage {

  event ValueSet(uint new_val);

  uint public storedData;

  function set(uint x) public {
    storedData = x;
    emit ValueSet(x);
  }

  function get() public view returns (uint) {
    return storedData;
  }
}
