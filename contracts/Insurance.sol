pragma solidity ^0.4.2;

contract Insurance {
  struct House {
    uint house_token;
    //In ether?
    uint total_to_insure;
    //In ether?
    uint amount_insured;
  }

  struct Stake {
    uint stake_token;
    // In ether?
    uint amount_insured;
  }

  //Bidirectional Mapping: may not be needed 
  mapping(address => uint) private address_to_client_token;
  uint[] private client_tokens;
  address[] public clients;

  mapping(uint => address) private client_token_to_address;

  //Client to their houses they want insured
  mapping(uint => uint[]) private client_token_to_house_tokens;

  mapping(uint => House) private house_info;

  //Insurer to which houses they are insuring
  mapping(address => uint) private address_to_insurer_token;
  mapping(uint => address) private insurer_token_to_address;

  mapping(uint => uint[]) private insurer_token_to_stake_tokens;

  mapping(uint => Stake) private stake_info;

  uint[] private insurer_tokens;

  address[] public insurers;

  /* TODOs for the functions:
  1.) What will be the smallest unit of currency? Wei
  2.) Storing to each of the mappings
  3.) Schedulized payments on addition to insurer (ETH-Alarm clock)
  4.) Cancelling insurance (end of term) and reimbursement/cancellation 
  of scheduled payments
  5.) Optional: Timing to fulfill insurance request/notification upon fulfillment 

  6. Optional: Allow users the option to refresh their insurance based on the price 
  of the house


  */

  //Getters and setters for all mappings above
  //

  function set_address_to_client_token(uint _client_token) public returns (uint) {
    //Sanity check, the address is already associated with an insurer
    if (address_to_client_token[msg.sender] > 0){
      return 2;
    }

    address_to_client_token[msg.sender] = _client_token;
    client_token_to_address[_client_token] = msg.sender;
    clients.push(msg.sender);
    client_tokens.push(_client_token);
    return 0;
  }



  function add_house_for_client(uint _house_token, uint _total_to_insure) public {

    uint client_token = address_to_client_token[msg.sender];

    //Sanity check, add throw error 
    assert (client_token > 0);

    House memory my_house = House({house_token: _house_token, total_to_insure: _total_to_insure, 
        amount_insured: 0});
    client_token_to_house_tokens[client_token].push(_house_token);
    house_info[_house_token] = my_house;

  }

  function set_address_to_insurer_token(uint _insurer_token) public returns (uint) {
    //Sanity check, the address is already associated with an insurer
    if (address_to_insurer_token[msg.sender] > 0){
      return 2; 
    }

    insurer_tokens.push(_insurer_token);
    insurers.push(msg.sender);
    address_to_insurer_token[msg.sender] = _insurer_token;
    insurer_token_to_address[_insurer_token] = msg.sender;
    return 0;
  }

  function add_stake_for_insurer(uint _stake_token, uint _amount_insured) public {
    uint insurer_token = address_to_insurer_token[msg.sender];

    //Sanity check, add throw error 
    assert (insurer_token > 0);

    Stake memory stake = Stake({stake_token: _stake_token, 
      amount_insured: _amount_insured});
    insurer_token_to_stake_tokens[insurer_token].push(_stake_token);
    stake_info[_stake_token] = stake;

  }

  




}


