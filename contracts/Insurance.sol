contract Insurance {
  struct House {
    uint house_token;
    //In ether?
    uint total_to_insure;
    //In ether?
    uint amount_insured;
  }

  struct InsurerStake {
    uint house_token;
    // In ether?
    uint amount_insured;
  }

  //Bidirectional Mapping: may not be needed 
  mapping(address => uint) public address_to_client_token;
  mapping(uint => address) public client_token_to_address;

  //Client to their houses they want insured
  mapping(uint => House[]) public client_token_to_house_tokens;

  //Insurer to which houses they are insuring
  mapping(uint => InsurerStake) public insurer_token_to_stakes;

  /* TODOs for the functions:
  1.) What will be the smallest unit of currency?
  2.) Storing to each of the mappings
  3.) Schedulized payments on addition to insurer (ETH-Alarm clock)
  4.) Cancelling insurance (end of term) and reimbursement/cancellation 
  of scheduled payments
  5.) Optional: Timing to fulfill insurance request/notification upon fulfillment 
  */

}