import { expect } from "chai";
import { ethers } from "hardhat";
import {Token__factory , Token} from "../typechain-types";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

describe("Token contract", () => {
  let Token:Token__factory;
  let token:Token
  let owner:SignerWithAddress, addr1:SignerWithAddress, addr2:SignerWithAddress;
  let other;

  beforeEach(async () => {
    Token = await ethers.getContractFactory(`Token`) as Token__factory;
    token = await Token.deploy();
    [owner, addr1, addr2, ...other] = await ethers.getSigners();
  });


  describe("Deployment", () => {
    it(`Should set the right owner`, async () => {
      expect(await token.owner()).to.equal(owner.address );
    });

    it(`Should assign the total supply of tokens to the owner`, async () => {
      const ownerBalance = await token.balanceOf( owner.address);
      expect(await token.totalSupply()).to.equal(ownerBalance);
    });
  });
 

  describe("Transactions", async () => {
    it(`Should transfer token to account`, async ()=>{
      await token.transfer( addr1.address,50);
      const addr1Balace = await token.balanceOf(addr1.address);
      expect(addr1Balace).to.equal(50);

      await token.connect(addr1).transfer( addr2.address, 50);
      const addr2Balace = await token.balanceOf(addr2.address);
      expect(addr2Balace).to.equal(50);
    });


    it(`Should fail if sender doesent have enough tokens`, async ()=>{
      const initialBalanceOwner = await token.balanceOf(owner.address);
      
      await expect(
         token
        .connect(addr1)
        .transfer(owner.address, 1)
      ).to.be.revertedWith("Not enoguhe tokens");

      expect(
        await token.balanceOf(owner.address)
      ).to.equal(initialBalanceOwner);

    });

    it(`Should update balances after transfer`, async ()=>{
      const initialBalanceOwner = await token.balanceOf(owner.address);

      await token.transfer( addr1.address,100);
      await token.transfer( addr2.address,50);

      const finalBalanceOwner = await token.balanceOf(owner.address);
      expect(finalBalanceOwner).to.equal(initialBalanceOwner.sub(150));

      const addr1Balace = await token.balanceOf(addr1.address);
      expect(addr1Balace).to.equal(100);

      const addr2Balace = await token.balanceOf(addr2.address);
      expect(addr2Balace).to.equal(50);
    })
      
  });


});
