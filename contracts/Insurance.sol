pragma solidity ^0.4.2;

contract Insurance {


  event Error (bytes32 description);

  event House_Fully_Insured_Success (uint house_token, uint[] stake_tokens);

  event House_Failed_To_Insure (uint house_token,
      uint[] stake_tokens);
  // event House_Fully_Insured_Success (uint house_token, address house_owner,
  //     uint[] stake_tokens, address[] stakeholders);

  // event House_Failed_To_Insure (uint house_token, address house_owner,
  //     uint[] stake_tokens, address[] stakeholders);

  event Monthly_House_Payment_Success (uint house_token, uint timestamtimestamp);

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


  function add_client_address(address _house_owner) public {
    assert(msg.sender == company_address);

    client_addresses.push(_house_owner);
    address_to_house_tokens[_house_owner] = new uint[](0);
  }



  function add_house_for_client(uint _house_token, address _house_owner, uint _total_to_insure, uint _minimum_stake_payment, uint _monthly_payment, 
    uint _monthly_stakeholder_dividend) public {
    assert(msg.sender == company_address);

    House memory my_house = House({house_owner: _house_owner, total_to_insure: _total_to_insure, 
        amount_insured: 0, stake_tokens: new uint[](0), minimum_stake_payment: _minimum_stake_payment, 
        monthly_payment: _monthly_payment, monthly_stakeholder_dividend: _monthly_stakeholder_dividend, is_fully_insured: false,
        payment_for_month_completed:false });

    address_to_house_tokens[_house_owner].push(_house_token);
    house_info[_house_token] = my_house;

  }

  function add_stakeholder_address(address _stakeholder_address) public {
    assert(msg.sender == company_address);


    stakeholder_addresses.push(_stakeholder_address);
    address_to_stake_tokens[_stakeholder_address] = new uint[](0);
  }

  function add_stake_for_stakeholder(uint _stake_token, address _stake_owner, uint _house_token, uint _amount_insured) public {
    assert(msg.sender == company_address);


    //TODO: Calculate percentage_staked


    Stake memory stake = Stake({house_token: _house_token, stake_owner: _stake_owner,
      amount_insured: _amount_insured, percentage_staked: 0});
    
    address_to_stake_tokens[_stake_owner].push(_stake_token);
    stake_token_to_address[_stake_token] = (_stake_owner);
    stake_info[_stake_token] = stake;

  }

  //Function house_expired
  function check_house_fully_insured(uint _house_token) returns (bool success){
    if (msg.sender != company_address) {
      return false;
    }

    House memory my_house = house_info[_house_token];

    if (my_house.amount_insured < my_house.total_to_insure) {
      uint[] memory my_stake_tokens = my_house.stake_tokens;

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

      emit House_Failed_To_Insure(_house_token, my_house.stake_tokens);

    }
    else {

      //
      bool is_insured = my_house.is_fully_insured;


      emit House_Fully_Insured_Success(_house_token, my_house.stake_tokens);
    }


    //Maintain invariant that house can't be over-insured
    
    
  }



  //Payable function that takes monthly payments in the exact amount  
  //

  //Immediately pay back to stakeholders 
  

  // 
  function make_montly_payment(uint _house_token) payable returns (bool success) {
    //msg.address and msg.value
    House memory my_house = house_info[_house_token];
    uint timestamp = block.timestamp;
    //Check if address of sender matches home owner
    if (msg.sender != my_house.house_owner){
      bytes32 error1 = "Homeowner does not match address";
      emit Monthly_House_Payment_Failed(_house_token, timestamp, error1);
      return false;
    }

    if (my_house.payment_for_month_completed){
      bytes32 error2 = "Payment already completed";
      emit Monthly_House_Payment_Failed(_house_token, timestamp, error2);
      return false;
    }

    //Maintain that payment amount by sender matches  
    uint my_monthly_payment = my_house.monthly_payment;
    if (msg.value < my_monthly_payment) {
      bytes32 error3 = "Payment not sufficient";
      emit Monthly_House_Payment_Failed(_house_token, timestamp, error3);
      return false;
    }

    my_house.payment_for_month_completed = true;
    if (msg.value > my_monthly_payment) {
      uint difference = msg.value - my_monthly_payment;
      msg.sender.transfer(difference);
    }

    //Pay back the stakeholders Immediately

    uint[] memory my_stake_tokens = my_house.stake_tokens;
    uint my_monthly_dividend = my_house.monthly_stakeholder_dividend;
    for (uint j = 0; j < my_stake_tokens.length; j++) {
      Stake memory my_stake = stake_info[my_stake_tokens[j]];
      uint dividend_amount = my_stake.percentage_staked;
      address stake_owner = my_stake.stake_owner;
      uint total_payout = uint(my_monthly_dividend * dividend_amount / (100));
      stake_owner.transfer(total_payout);
    }


    return true;



  }
/*
  //Sends monthly payments to stakeholders if monthly payment made correctly
  //Otherwise homeowner has failed to pay, and reimburses the stakeholders
<<<<<<< HEAD
  function check_monthly_payments_complete {
    if (msg.sender != company_address) {
      return 0;
    }


=======
  function check_monthly_payments_complete() {
>>>>>>> 798849e9d14e111da64026a1773951a64e7fa2cb
    for(i = 0; i < fully_insured_house_tokens.length; i++) {
      if (fully_insured_house_tokens[i].is_fully_insured) {
        fully_insured_house_tokens[i].is_fully_insured = false;

        //emit Monthly_House_Payment_Success (fully_insured_house_tokens[i], block.timestamp);
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


