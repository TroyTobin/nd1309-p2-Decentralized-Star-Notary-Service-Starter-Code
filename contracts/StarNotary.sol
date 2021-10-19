pragma solidity >=0.4.24;

//Importing openzeppelin-solidity ERC-721 implemented Standard
import "../node_modules/openzeppelin-solidity/contracts/token/ERC721/ERC721.sol";

// StarNotary Contract declaration inheritance the ERC721 openzeppelin implementation
contract StarNotary is ERC721 {

    // Star data
    struct Star {
        string name;
    }

    // name: Is a short name to your token
    string public constant name = "StarNotary Token";
    // symbol: Is a short string like 'USD' -> 'American Dollar'
    string public constant symbol = "SNT";

    // mapping the Star with the Owner Address
    mapping(uint256 => Star) public tokenIdToStarInfo;
    // mapping the TokenId and price
    mapping(uint256 => uint256) public starsForSale;

      
    // Create Star using the Struct
    function createStar(string memory _name, uint256 _tokenId) public { // Passing the name and tokenId as a parameters
        Star memory newStar = Star(_name); // Star is an struct so we are creating a new Star
        tokenIdToStarInfo[_tokenId] = newStar; // Creating in memory the Star -> tokenId mapping
        _mint(msg.sender, _tokenId); // _mint assign the the star with _tokenId to the sender address (ownership)
    }

    // Putting an Star for sale (Adding the star tokenid into the mapping starsForSale, first verify that the sender is the owner)
    function putStarUpForSale(uint256 _tokenId, uint256 _price) public {
        address ownerAddress = ownerOf(_tokenId);

        require(ownerAddress == msg.sender, "You can't sale the Star you don't owned");
        
        starsForSale[_tokenId] = _price;
    }


    // Function that allows you to convert an address into a payable address
    function _make_payable(address x) internal pure returns (address payable) {
        return address(uint160(x));
    }

    function buyStar(uint256 _tokenId) public  payable {

        uint256 starCost = starsForSale[_tokenId];

        // Sanity check before proceeding
        require(starCost > 0, "The Star needs to be up for sale");
        require(msg.value > starCost, "You don't have enough Ether");

        address ownerAddress = ownerOf(_tokenId);
        
        // We need to make this conversion to be able to use transfer() function to transfer ethers
        address payable ownerAddressPayable = _make_payable(ownerAddress);

        // Transfer the token
        _transferFrom(ownerAddress, msg.sender, _tokenId);

        // Transfer the balances
        ownerAddressPayable.transfer(starCost);
        if(msg.value > starCost) {
            msg.sender.transfer(msg.value - starCost);
        }
    }

    // Function that looked up a Star info by token ID
    function lookUptokenIdToStarInfo (uint _tokenId) public view returns (string memory) {
        // Simply returns the start name
        return tokenIdToStarInfo[_tokenId].name;

    }

    // Function to exchange Star between two addresses
    function exchangeStars(uint256 _tokenId1, uint256 _tokenId2) public {
        // Get the owner of each Star token
        address ownerAddressToken1 = ownerOf(_tokenId1);
        address ownerAddressToken2 = ownerOf(_tokenId2);
        address sender = msg.sender;

        // Sanity check the sender of the message owns one of the tokens
        require(ownerAddressToken1 == sender || ownerAddressToken2 == sender, 
                "The sender does not own either of the Stars being transfered");

        // Transfer Stars between the addresses
        _transferFrom(ownerAddressToken1, ownerAddressToken2, _tokenId1);
        _transferFrom(ownerAddressToken2, ownerAddressToken1, _tokenId2);

    }

    // Function to transfer a Star token
    function transferStar(address _to1, uint256 _tokenId) public {
        // The addres of the token owner
        address ownerAddresToken = ownerOf(_tokenId);

        // Sanity check the sender is the owner of the token
        require(ownerAddresToken == msg.sender, "You can't transfer a Star you don't own");

        // Transfer the Star token
        _transferFrom(ownerAddresToken, _to1, _tokenId);
    }
}