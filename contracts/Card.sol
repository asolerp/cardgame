pragma solidity 0.7.6;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract Card is ERC721 {

    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    mapping(string => uint8) hashes;
    mapping(address => uint256[]) nfts;
    mapping(uint256 => address) cardIndexToOwner;

    constructor() public ERC721("CardGame", "CARDGAME") {}

    function awardItem(address recipient)
    public
    returns (uint256)
    {
        _tokenIds.increment();
        uint256 newItemId = _tokenIds.current();
        _mint(recipient, newItemId);
        _setTokenURI(newItemId, 'ipfs://Qmd5EKJ3aGYQ5w1jZqfr5Kjpvjtc1bmTEcZQps3QcJVWPo');
        nfts[address].push(newItemId);
        cardIndexToOwner[newItemId] = address;
        return newItemId;
    }

    function tokensOfOwner(address _owner) external view returns(uint256[] ownerTokens) {
    uint256 tokenCount = balanceOf(_owner);

    if (tokenCount == 0) {
        // Return an empty array
        return new uint256[](0);
    } else {
        uint256[] memory result = new uint256[](tokenCount);
        uint256 totalCarts = totalSupply();
        uint256 resultIndex = 0;

        // We count on the fact that all cats have IDs starting at 1 and increasing
        // sequentially up to the totalCat count.
        uint256 cardId;

        for (cardId = 1; cardId <= totalCarts; cardId++) {
            if (cardIndexToOwner[cardId] == _owner) {
                result[resultIndex] = cardId;
                resultIndex++;
            }
        }

        return result;
        }
    }
}