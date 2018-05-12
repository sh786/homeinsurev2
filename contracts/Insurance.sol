pragma solidity ^0.4.2;

contract Insurance {


  event Error (bytes32 description);

  event House_Fully_Insured_Success (uint house_token, uint[] stake_tokens);

  event House_Failed_To_Insure (uint house_token, uint[] stake_tokens);
  // event House_Fully_Insured_Success (uint house_token, address house_owner,
  //     uint[] stake_tokens, address[] stakeholders);

  // event House_Failed_To_Insure (uint house_token, address house_owner,
  //     uint[] stake_tokens, address[] stakeholders);

  event yearly_House_Payment_Success (uint house_token, uint timestamtimestamp);

  event yearly_House_Payment_Failed (uint house_token, uint , bytes32 error);

  event Stake_Contribution (uint stake_token, uint stake_amount_insured);

  event Stake_Contribution_Fail (uint stake_token, uint stake_amount_insured);


  address public company_address;

  function initialize_contract() { 
    company_address = msg.sender;
  }


  
  struct House {
    //uint house_token;
    address house_owner;

    //In Wei
    uint total_to_insure;
    uint total_currently_insured;

    uint[] stake_tokens;

    //Each stake will have to be a multiple of this minimum stake - 1% 
    //uint minimum_stake_payment;

    //FROM talking with Sam and Chris, a user will insure for 10,000, but make a 
    //11,000 payment towards us. $1000 will stay in the contract, as our company cut 
    //And 10,000 will be distributed back towards the stakeholder 
    //

    uint yearly_payment;

    uint yearly_stakeholder_dividend;

    bool is_fully_insured;

    bool payment_for_year_completed;
    //uint total_insurance_contribution
    address house_evaluator;
    bool is_claim_active;
    uint claim_amount;

  }

  struct Stake {
    //uint stake_token;
    uint house_token;
    address stake_owner;
    // In ether?
    uint amount_insured;
  }

  //Bidirectional Mapping: may not be needed 
  //mapping(address => uint) private address_to_client_token;
  //address[] public clients;

  mapping(address => uint) public balances;

  //mapping(uint => address) private client_token_to_address;

  //Client to their houses they want insured
  mapping(address => uint[]) public address_to_house_tokens;

  mapping(address => uint[]) public evaluator_to_house_tokens;

  mapping(uint => House) public house_info;


  //Insurer to which houses they are insuring
  //mapping(address => uint) private address_to_insurer_token;
  
  mapping(address => uint[]) public address_to_stake_tokens;

  mapping(uint => Stake) public stake_info;

  uint public num_things = 0;
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
  function get_num_things() public returns (uint){
    return num_things; 
  }


  function add_client_address() public {
    //client_addresses.push(_house_owner);
    address_to_house_tokens[msg.sender] = new uint[](0);
  }

  function get_address_to_house_tokens(address _my_address) public returns (uint[] tokens){
    return address_to_house_tokens[_my_address];
  }

  //Called after insurer finishes an evaluation on the UI
  function add_evaluation(uint _house_token,  uint _total_to_insure, uint _yearly_payment, 
    uint _yearly_stakeholder_dividend) public returns (bool success) {
    House memory my_house = house_info[_house_token];
    my_house.house_evaluator = msg.sender;
    my_house.total_to_insure = _total_to_insure;
    my_house.yearly_payment = _yearly_payment;
    my_house.yearly_stakeholder_dividend = _yearly_stakeholder_dividend;
    house_info[_house_token] = my_house;
    return true;
  }

  function get_house_evaluator(uint _house_token) public returns (address evaluator) {

    return house_info[_house_token].house_evaluator;
  }

  function get_homeowner(uint _house_token) public returns (address homeowner) {

    return house_info[_house_token].house_owner;
  }

  function get_yearly_stakeholder_dividend(uint _house_token) public returns (uint amount) {
    return house_info[_house_token].yearly_stakeholder_dividend;
  }

  //When database hits submit, we add data to the chain  
  function add_house_for_client(uint _house_token) public {

    address _house_owner = msg.sender;
    House memory my_house = House({house_owner: _house_owner, total_to_insure: 0, total_currently_insured: 0, 
        stake_tokens: new uint[](0), yearly_payment: 0, yearly_stakeholder_dividend: 0, 
        is_fully_insured: false, payment_for_year_completed:false, house_evaluator: company_address, is_claim_active:false, claim_amount: 0});

    address_to_house_tokens[_house_owner].push(_house_token);
    house_info[_house_token] = my_house;
  }

  //Run a script that calls this function montly if 
  //Also call this if the user declines their quote 
  function check_house_expired_or_declined(uint _house_token) returns (bool success){
    
    House memory my_house = house_info[_house_token];

    if (msg.sender != my_house.house_owner && msg.sender != company_address){
      return false;
    }

    if (!my_house.is_fully_insured) {
      uint[] memory my_stake_tokens = my_house.stake_tokens;

      //length_stake_tokent = 
      for (uint i=0; i<my_stake_tokens.length; i++) {
        Stake memory stake = stake_info[my_stake_tokens[i]];

        address stake_address = stake.stake_owner;
        uint stake_amount = stake.amount_insured;

        stake_address.transfer(stake_amount);
        delete stake_info[my_stake_tokens[i]];

      }

      delete house_info[_house_token];

      // emit House_Failed_To_Insure(_house_token, my_house.stake_tokens);
      return true;
    }
    return false;
    


    //Maintain invariant that house can't be over-insured
    
    
  }

  //Called when funding is completed and user hits submit 
  function make_initial_payment(uint _house_token) payable returns (bool success) {

    //Needs to check that house is fully insured

        //msg.address and msg.value
    House memory my_house = house_info[_house_token];

  
    uint timestamp = block.timestamp;
    //Check if address of sender matches home owner
    if (msg.sender != my_house.house_owner){
      bytes32 error1 = "Homeowner does not match address";
      emit yearly_House_Payment_Failed(_house_token, timestamp, error1);
      msg.sender.transfer(msg.value);
      return false;
    }

    if (!my_house.is_fully_insured) {
      bytes32 error4 = "Home not yet fully insured";
      emit yearly_House_Payment_Failed(_house_token, timestamp, error4);
      msg.sender.transfer(msg.value);
      return false;
    }

    if (my_house.payment_for_year_completed){
      bytes32 error2 = "Payment already completed";
      emit yearly_House_Payment_Failed(_house_token, timestamp, error2);
      msg.sender.transfer(msg.value);
      return false;
    }

    //Maintain that payment amount by sender matches  
    uint my_yearly_payment = my_house.yearly_payment;
    if (msg.value < my_yearly_payment) {
      bytes32 error3 = "Payment not sufficient";
      emit yearly_House_Payment_Failed(_house_token, timestamp, error3);
      msg.sender.transfer(msg.value);
      return false;
    }

    my_house.payment_for_year_completed = true;
    if (msg.value > my_yearly_payment) {
      uint difference = msg.value - my_yearly_payment;
      msg.sender.transfer(difference);
    }

    house_info[_house_token] = my_house;

    return payout_stakeholders(_house_token);
  }

  function payout_stakeholders(uint _house_token) internal returns (bool success){
    House memory my_house = house_info[_house_token];
    uint[] memory my_stake_tokens = my_house.stake_tokens;
    uint my_yearly_dividend = my_house.yearly_stakeholder_dividend;
    for (uint j = 0; j < my_stake_tokens.length; j++) {
      Stake memory my_stake = stake_info[my_stake_tokens[j]];
      address stake_owner = my_stake.stake_owner;
      uint total_payout = uint(my_yearly_dividend * my_stake.amount_insured/my_house.total_to_insure);
      stake_owner.transfer(total_payout);
    }
    return true;

  }

  //Both functions are called when Insurer calls functions 
  function create_insurance_claim (uint _house_token, uint _claim_amount) returns (bool success) { 
    House memory my_house = house_info[_house_token];
    if (my_house.house_evaluator != msg.sender) {
      return false;
    }
    my_house.is_claim_active = true;
    my_house.claim_amount = _claim_amount;
    house_info[_house_token] = my_house;

    return accept_insurance_claim(_house_token);

  }

  function accept_insurance_claim (uint _house_token) internal returns (bool success) { 
    House memory my_house = house_info[_house_token];
    address my_house_owner = my_house.house_owner;
    if (!my_house.is_claim_active) {
      return false;
    }
    my_house_owner.transfer(my_house.claim_amount);
    uint remaining_payout = my_house.total_to_insure - my_house.claim_amount;
    uint[] memory my_stake_tokens = my_house.stake_tokens;
    for (uint j = 0; j < my_stake_tokens.length; j++) {
      Stake memory my_stake = stake_info[my_stake_tokens[j]];
      address stake_owner = my_stake.stake_owner;
      uint total_payout = uint(remaining_payout * my_stake.amount_insured/my_house.total_to_insure);
      stake_owner.transfer(total_payout);
    }

    delete house_info[_house_token];
    return true;

  }




  // function add_stakeholder_address(address _stakeholder_address) public {
  //   address_to_stake_tokens[_stakeholder_address] = new uint[](0);
  // }

  //payment_expected in WEI
  function add_stake_for_stakeholder(uint _stake_token, uint _house_token, uint payment_expected) public payable returns (bool success){
    address _stake_owner = msg.sender;

    House memory house = house_info[_house_token];
    if (house.is_fully_insured) {
      msg.sender.transfer(msg.value);
      return false;
    }

    uint remaining_to_insure = house.total_to_insure - (payment_expected + house.total_currently_insured);

    if (remaining_to_insure < 0) {
      msg.sender.transfer(msg.value);
      //emit Stake_Contribution_Fail(_stake_token, msg.value);
      return false;
    }

    
    if (payment_expected > msg.value) { 
      msg.sender.transfer(msg.value);
      emit Stake_Contribution_Fail(_stake_token, msg.value);
      return false;
    }

    if (payment_expected <= msg.value) {
      uint over_payment = msg.value - payment_expected;
      if (over_payment > 0) {
        emit Stake_Contribution(_stake_token, msg.value);
        msg.sender.transfer(over_payment);
      }
    }

    house.total_currently_insured = house.total_currently_insured + msg.value;

    if (house.total_currently_insured == house.total_to_insure) {
      house.is_fully_insured = true;
    }

    Stake memory stake = Stake({house_token: _house_token, stake_owner: _stake_owner,
      amount_insured: msg.value});
    
    address_to_stake_tokens[_stake_owner].push(_stake_token);
    stake_info[_stake_token] = stake;
    house_info[_house_token] = house;

    return true;

  }

  


  //Payable function that takes yearly payments in the exact amount  
  //

  //Immediately pay back to stakeholders 
  

  

  //TODO: Paying out a plan


  // function 
/*
  //Sends yearly payments to stakeholders if yearly payment made correctly
  //Otherwise homeowner has failed to pay, and reimburses the stakeholders
<<<<<<< HEAD
  function check_yearly_payments_complete {
    if (msg.sender != company_address) {
      return 0;
    }


=======
  function check_yearly_payments_complete() {
>>>>>>> 798849e9d14e111da64026a1773951a64e7fa2cb
    for(i = 0; i < fully_insured_house_tokens.length; i++) {
      if (fully_insured_house_tokens[i].is_fully_insured) {
        fully_insured_house_tokens[i].is_fully_insured = false;

        //emit yearly_House_Payment_Success (fully_insured_house_tokens[i], block.timestamp);
      }
      else {
        //Throw em out of the smart contract, pay everyone back
        House memory my_house = house_info[fully_insured_house_tokens[i]]
        uint[] my_stake_tokens = my_house.stake_tokens;
        for (uint j = 0; j < my_stake_tokens.length; j++) {
          Stake memory my_stake = stake_info[my_stake_tokens[i]];
          uint pay_back = my_stake.amount_insured;
          address stake_owner = my_stake.stake_owner;
          stake_owner.transfer(pay_back);
        
        }
      }

    } 
    return 1;
  }

<<<<<<< HEAD
  function pay_insurance_claim (uint _house_token, uint payment_amount) {
    if (msg.sender != company_address) {
      return 0;
    }
=======
  function pay_insurance_claim() {
>>>>>>> 798849e9d14e111da64026a1773951a64e7fa2cb

    House memory my_house = house_info[_house_token];


    uint my_amount_insured = my_house.amount_insured;  
    uint my_stake_tokens = my_house.stake_tokens;
    if (my_amount_insured < payment_amount) {
      //event failed
      return 0;

    }

    uint amount_payback_stakeholders = my_amount_insured - payment_amount;
    address homeowner = my_house.house_owner;

    homeowner.transfer(payment_amount);

    for (uint j = 0; j < my_stake_tokens.length; j++) {
      Stake memory my_stake = stake_info[my_stake_tokens[i]];
      uint dividend_amount = my_stake.percentage_staked; 
      uint pay_back = uint((my_stake.amount_insured * dividend_amount / 100));
      address stake_owner = my_stake.stake_owner;
      stake_owner.transfer(pay_back);
    }
    return 1;

  }
*/






}


