// SPDX-License-Identifier: MIT
// Inspired by Azuki.sol

pragma solidity ^0.8.0;

import "./Ownable.sol";
import "./ReentrancyGuard.sol";
import "./ERC721A.sol";
import "./Strings.sol";
//import "./MerkleProof.sol";

library MerkleProof {
    /**
     * @dev Returns true if a `leaf` can be proved to be a part of a Merkle tree
     * defined by `root`. For this, a `proof` must be provided, containing
     * sibling hashes on the branch from the leaf to the root of the tree. Each
     * pair of leaves and each pair of pre-images are assumed to be sorted.
     */
    function verify(
        bytes32[] memory proof,
        bytes32 root,
        bytes32 leaf
    ) internal pure returns (bool) {
        bytes32 computedHash = leaf;

        for (uint256 i = 0; i < proof.length; i++) {
            bytes32 proofElement = proof[i];

            if (computedHash < proofElement) {
                // Hash(current computed hash + current element of the proof)
                computedHash = keccak256(
                    abi.encodePacked(computedHash, proofElement)
                );
            } else {
                // Hash(current element of the proof + current computed hash)
                computedHash = keccak256(
                    abi.encodePacked(proofElement, computedHash)
                );
            }
        }

        // Check if the computed hash (root) is equal to the provided root
        return computedHash == root;
    }
    

}

contract krokro is Ownable, ERC721A, ReentrancyGuard {

  // supplies
  uint256 public immutable MAX_SUPPLY=20;
  //uint256 public immutable MAX_BATCH_SIZE=100;

  // max to mint per wallet
  uint256 public immutable MAX_PER_ADDRESS_DURING_MINT_AUCTION=0;
  uint256 public immutable MAX_PER_ADDRESS_DURING_MINT_PUBLIC=3;
  uint256 public immutable MAX_PER_ADDRESS_DURING_MINT_ALLOWLIST=3;

  // max to mint in total
  uint256 public immutable AMOUNT_FOR_DEVS=5;
  uint256 public immutable AMOUNT_FOR_AUCTION=0;
  uint256 public immutable AMOUNT_FOR_ALLOWLIST=10;

  // mint prices
  uint256 public immutable MINT_PRICE_PUBLIC=0.02 ether;
  uint256 public immutable MINT_PRICE_ALLOWLIST=0.01 ether;

  // AUCTION CONFIGURATION
  uint256 public constant AUCTION_START_PRICE=0 ether;
  uint256 public constant AUCTION_END_PRICE=0 ether;
  uint256 public constant AUCTION_PRICE_CURVE_LENGTH=1 minutes;
  uint256 public constant AUCTION_DROP_INTERVAL=1 minutes;

  // trackers
  uint256 public mintedWithAllowList=0;
  uint256 public mintedWithAuction=0;

  // sale active flags
  bool public publicSaleActive = false;
  bool public allowListSaleActive = false;
  bool public auctionActive = false;

  uint256 public auctionSaleStartTime=0;
  //bool public revealed = false;
  address private _platformAddress = 0x1591C783EfB2Bf91b348B6b31F2B04De1442836c;
  uint256 private PLATFORM_ROYALTY=50; // 1000 = 100%

  bytes32 private _allowListRoot;
  mapping(address => uint256) private _allowListClaimed;


  // CONSTRUCTOR
  constructor() ERC721A("kro kro", "kk", MAX_PER_ADDRESS_DURING_MINT_PUBLIC, MAX_SUPPLY){}

  // MODIFIERS
  modifier callerIsUser() {
    require(tx.origin == msg.sender, "The caller is another contract");
    _;
  }

  modifier onlyPlatform() {
    require(
      _platformAddress == _msgSender(),
      "Ownable: caller is not the platform"
    );
    _;
  }

  modifier onlyOwnerOrPlatform() {
    require(
      owner() == _msgSender() || _platformAddress == _msgSender(),
      "Ownable: caller is not the owner neither the platform"
    );
    _;
  }



  // MINT FUNCTIONS
  function auctionMint(uint256 numTokens) external payable callerIsUser {
    require(auctionActive, "sale has not started yet");
    require(
      totalSupply() + numTokens <= AMOUNT_FOR_AUCTION,
      "not enough remaining for auction"
    );
    require(
      numberMinted(msg.sender) + numTokens <= MAX_PER_ADDRESS_DURING_MINT_AUCTION && (mintedWithAuction + numTokens <= AMOUNT_FOR_AUCTION),
      "can not mint this many"
    );
    uint256 totalCost = getAuctionPrice(auctionSaleStartTime) * numTokens;
    require(
      msg.value >= totalCost * numTokens,
      "not enough Ether sent"
    );

    mintedWithAuction += numTokens;
    _safeMint(msg.sender, numTokens);
  }

  function mintAllowList(uint256 numTokens, bytes32[] calldata proof) external payable {
    require(
      Address.isContract(msg.sender) == false,
      "Cannot mint from a contract"
    );
    require(
      _verify(_leaf(msg.sender), proof),
      "Address is not on allowlist"
    );
    require(allowListSaleActive, "The pre-sale is not active");
    require(
      (_allowListClaimed[msg.sender] + numTokens <= MAX_PER_ADDRESS_DURING_MINT_ALLOWLIST) && (mintedWithAllowList + numTokens <= AMOUNT_FOR_ALLOWLIST) && (totalSupply() + numTokens <= MAX_SUPPLY),  // max to mint by 1 address
      "can not mint this many"
    );
    //require(
    //  totalSupply() + numTokens <= MAX_SUPPLY,
    //  "Purchase would exceed max tokens"
    //);
    require(
      msg.value >= MINT_PRICE_ALLOWLIST * numTokens,
      "not enough Ether sent"
    );

    _allowListClaimed[msg.sender] = _allowListClaimed[msg.sender] + numTokens;

    mintedWithAllowList += numTokens;  // increase the allowList mint tracker
    _safeMint(msg.sender, numTokens);
  }

  function publicSaleMint(uint256 numTokens) external payable callerIsUser
  {
    require(
      msg.value >= MINT_PRICE_PUBLIC * numTokens,
      "not enough Ether sent"
    );
    require(publicSaleActive, "public sale has not begun yet");
    //require(totalSupply() + numTokens <= MAX_SUPPLY, "Purchase would exceed max tokens");
    require(
      totalSupply() + numTokens <= MAX_SUPPLY && // added cause the above is commented out
      numTokens <= MAX_PER_ADDRESS_DURING_MINT_PUBLIC, // max to mint in 1 Tx
      "can not mint this many"
    );
    _safeMint(msg.sender, numTokens);
  }

  // For marketing etc.
  function devMint(uint256 numTokens) external onlyOwner {
    require(
      totalSupply() + numTokens <= AMOUNT_FOR_DEVS,
      "can not mint this many"
    );
    require(
      numTokens % MAX_PER_ADDRESS_DURING_MINT_PUBLIC == 0,
      "can only mint a multiple of the MAX_PER_ADDRESS_DURING_MINT_PUBLIC"
    );
    uint256 numChunks = numTokens / MAX_PER_ADDRESS_DURING_MINT_PUBLIC;
    for (uint256 i = 0; i < numChunks; i++) {
      _safeMint(msg.sender, MAX_PER_ADDRESS_DURING_MINT_PUBLIC);
    }
  }



  // AUCTION CONFIGURATION
  uint256 public constant AUCTION_DROP_PER_STEP =
    (AUCTION_START_PRICE - AUCTION_END_PRICE) /
      (AUCTION_PRICE_CURVE_LENGTH / AUCTION_DROP_INTERVAL);

  function getAuctionPrice(uint256 _saleStartTime) public view returns (uint256)
  {
    if (block.timestamp < _saleStartTime) {
      return AUCTION_START_PRICE;
    }
    if (block.timestamp - _saleStartTime >= AUCTION_PRICE_CURVE_LENGTH) {
      return AUCTION_END_PRICE;
    } else {
      uint256 steps = (block.timestamp - _saleStartTime) /
        AUCTION_DROP_INTERVAL;
      return AUCTION_START_PRICE - (steps * AUCTION_DROP_PER_STEP);
    }
  }



  // metadata URI
  //string private _baseTokenURI;
  string private _baseTokenURI = string(
    abi.encodePacked(
      "https://easylaunchnft.com/api/",
      "krokro",
      "/"
    )
  );

  function _baseURI() internal view virtual override returns (string memory) {
    return _baseTokenURI;
  }  
  
  function setBaseURI(string calldata baseURI) external onlyOwner {
    _baseTokenURI = baseURI;
  }

  

  function numberMinted(address owner) public view returns (uint256) {
    return _numberMinted(owner);
  }

  function getOwnershipData(uint256 tokenId)
    external
    view
    returns (TokenOwnership memory)
  {
    return ownershipOf(tokenId);
  }



  // ONLY OWNER


  //function setOwnersExplicit(uint256 numTokens) external onlyOwner nonReentrant {
  //  _setOwnersExplicit(numTokens);
  //}

  function setPublicSaleActive(bool _publicSaleActive) public onlyOwner {
    publicSaleActive = _publicSaleActive;
  }

  function setAuctionActive(bool _auctionActive) public onlyOwner {
    auctionActive = _auctionActive;
    auctionSaleStartTime = block.timestamp;  // start auction right now
  }

  function setAllowListSaleActive(bool _allowListSaleActive) public onlyOwner {
    allowListSaleActive = _allowListSaleActive;
  }  
  
  //function reveal() public onlyOwner {
  //  revealed = true;
  //}

  function setAllowListRoot(bytes32 _root) public onlyOwner {
    _allowListRoot = _root;
  }

  function withdraw() external onlyOwnerOrPlatform nonReentrant {
    address owner_ = owner();
    uint256 balanceUnits = address(this).balance / 1000;
    Address.sendValue(
        payable(_platformAddress),
        PLATFORM_ROYALTY * balanceUnits
    );
    Address.sendValue(
        payable(owner_),
        (1000 - PLATFORM_ROYALTY) * balanceUnits
    );
  }



  // ALLOW LIST - MERKLE PROOF 
  function _leaf(address account) internal pure returns (bytes32) {
    return keccak256(abi.encodePacked(account));
  }

  function _verify(bytes32 _leafNode, bytes32[] memory proof)
    internal
    view
    returns (bool)
  {
    return MerkleProof.verify(proof, _allowListRoot, _leafNode);
  }

}
