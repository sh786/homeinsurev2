pragma solidity ^0.4.2;

contract Insurance {


  event Error (bytes32 description);

  event House_Fully_Insured_Success (uint house_token, uint[] stake_tokens);

  event House_Failed_To_Insure (uint house_token
      uint[] stake_tokens);
  // event House_Fully_Insured_Success (uint house_token, address house_owner,
  //     uint[] stake_tokens, address[] stakeholders);

  // event House_Failed_To_Insure (uint house_token, address house_owner,
  //     uint[] stake_tokens, address[] stakeholders);

  event Monthly_House_Payment_Success (uint house_token, uint timestamtimestampp);

  event Monthly_House_Payment_Failed (uint house_token, uint , bytes32 error);

  event Stake_Contribution (uint stake_token, uint stake_amount_insured);

  address constant public company_address = 0xe0f5206bbd039e7b0592d8918820024e2a7437b9;


  
  struct House {
    //uint house_token;
    address house_owner;
    //In ether?
    uint total_to_insure;
    //In ether?
    uint amount_insured;
    uint[] stake_tokens;

    //Each stake will have to be a multiple of this minimum stake - 1% 
    uint minimum_stake_payment;


    //FROM talking with Sam and Chris, a user will insure for 10,000, but make a 
    //11,000 payment towards us. $1000 will stay in the contract, as our company cut 
    //And 10,000 will be distributed back towards the stakeholder 
    //

    uint monthly_payment;

    uint monthly_stakeholder_dividend;

    bool is_fully_insured;

    bool payment_for_month_completed;
    //uint total_insurance_contribution
  }

  struct Stake {
    //uint stake_token;
    uint house_token;
    address stake_owner;
    // In ether?
    uint amount_insured;
    uint percentage_staked;
  }

  //Bidirectional Mapping: may not be needed 
  //mapping(address => uint) private address_to_client_token;
  address[] private client_addresses;
  //address[] public clients;

  mapping(address => uint) private balances;

  //mapping(uint => address) private client_token_to_address;

  //Client to their houses they want insured
  mapping(address => uint[]) private address_to_house_tokens;

  mapping(uint => House) private house_info;

  uint[] private fully_insured_house_tokens;

  //Insurer to which houses they are insuring
  //mapping(address => uint) private address_to_insurer_token;
  
  mapping(uint => address) private stake_token_to_address;

  mapping(address => uint[]) private address_to_stake_tokens;

  mapping(uint => Stake) private stake_info;
  address[] private stakeholder_addresses;

  //uint[] private insurer_tokens;

  //address[] public insurers;

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
        amount_insured: 0, ow});
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

  //Function house_expired
  function check_house_fully_insured(uint _house_token) returns (bool success){
    if (msg.sender != company_address) {
      return false;
    }

    House memory my_house = house_info[_house_token];

    if (my_house.amount_insured < my_house.total_to_insure) {
      my_stake_tokens = my_house.stake_tokens

      //length_stake_tokent = 
      for (uint i=0; i<my_stake_tokens.length; i++) {
        Stake memory stake = stake_info[my_stake_tokens[i]];

        //stake_address = stake_token_to_address[i];
        address stake_address = stake.stake_owner;
        uint stake_amount = stake.amount_insured;

        stake_address.transfer(stake_amount);
        delete stake_info[my_stake_tokens[i]];

      }

      delete house_info[_house_token];

      emit House_Failed_To_Insure(my_house.house_token, my_house.stake_tokens);

    }
    else () {

      //
      bool is_insured = my_house.is_fully_insured;


      emit House_Fully_Insured_Success(my_house.house_token, my_house.stake_tokens);
    }


    //Maintain invariant that house can't be over-insured
    
    
  }



  //Payable function that takes monthly payments in the exact amount  
  //

  //Immediately pay back to stakeholders 
  

  // 
  function make_montly_payment(uint _house_token) payable returns (bool success) {
    //msg.address and msg.value
    House memory my_house = house_info[_house_token]
    uint timestamp = block.timestamp;
    //Check if address of sender matches home owner
    if (msg.sender != my_house.house_owner){
      bytes32 error = "Homeowner does not match address";
      emit Monthly_House_Payment_Failed(_house_token, timestamp, error);
      return False;
    }

    if (my_house.payment_for_month_completed){
      bytes32 error = "Payment already completed";
      emit Monthly_House_Payment_Failed(_house_token, timestamp, error);
      return False;
    }

    //Maintain that payment amount by sender matches  
    uint my_monthly_payment = my_house.monthly_payment;
    if (msg.value < my_monthly_payment) {
      bytes32 error = "Payment not sufficient"
      emit Monthly_House_Payment_Failed(_house_token, timestamp, error);
      return False;
    }

    my_house.payment_for_month_completed = True;
    if (msg.value > my_montly_payment) {
      uint difference = msg.value - my_montly_payment;
      msg.sender.transfer(difference);
    }

    //Pay back the stakeholders Immediately

    uint[] my_stake_tokens = my_house.stake_tokens;
    uint my_monthly_dividend = my_house.monthly_stakeholder_dividend;
    for (uint j = 0; j < my_stake_tokens.length; j++) {
      Stake memory my_stake = stake_info[my_stake_tokens[i]];
      uint dividend_amount = my_stake.percentage_staked;
      address stake_owner = my_stake.stake_owner;
      uint total_payout = uint(my_monthly_divided * dividend_amount / (100));
      stake_owner.transfer(total_payout);
    }


    return True;



  }

  //Sends monthly payments to stakeholders if monthly payment made correctly
  //Otherwise homeowner has failed to pay, and reimburses the stakeholders
  function check_monthly_payments_complete {
    for(i = 0; i < fully_insured_house_tokens.length; i++) {
      if (fully_insured_house_tokens[i].is_fully_insured) {
        fully_insured_house_tokens[i].is_fully_insured = false;
      }
      else {
        //Throw em out of the smart contract, pay everyone back

      }
    }

  }

  function pay_insurance_claim {



  }







}


