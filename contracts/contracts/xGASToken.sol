// SPDX-License-Identifier: MIT
pragma solidity ^0.8.1;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract XGASToken is ERC20, Ownable {
    address private _operator;

    event OperatorTransferred(address indexed previousOperator, address indexed newOperator);

    constructor() ERC20("xGAS", "xGAS") {
        _operator = _msgSender();
    }

    modifier onlyOperator() {
        require(_msgSender() == _operator, "XGASToken: caller is not the operator");
        _;
    }

    function operator() public view returns (address) {
        return _operator;
    }

    function transferOperator(address newOperator) public onlyOwner {
        require(newOperator != address(0), "XGASToken: new operator is the zero address");
        emit OperatorTransferred(_operator, newOperator);
        _operator = newOperator;
    }

    function mint(address to, uint256 amount) external onlyOperator {
        _mint(to, amount);
    }

    function burn(address from, uint256 amount) external onlyOperator {
        _burn(from, amount);
    }
}