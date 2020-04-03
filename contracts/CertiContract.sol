pragma solidity ^0.5.1;

contract ECerti{

    string[] public indexs;
    uint public totalsupply;
    struct StudentData{
        string name;
        string email;
        string doi;
        address issuer;
        string topic;
    }

    mapping (string => StudentData) index;


    function addCerti(string memory name, string memory email,string memory doi,string memory topic,string memory indexhash) public{
        index[indexhash] = StudentData(name,email,doi,msg.sender,topic);
        indexs.push(indexhash);
        totalsupply++;
    }

    function viewCerti(string memory indexhash) public view returns(string memory,string memory,string memory,address,string memory){
     StudentData storage s1 = index[indexhash];
     return(s1.name,s1.email,s1.doi,s1.issuer,s1.topic);
    }
}
