import { ethers } from 'ethers';
import TicketingSFTAbi from '../contracts/TicketingSFT.json';

// Replace with your deployed contract address
const CONTRACT_ADDRESS = '0x742d35Cc6634C0532925a3b844Bc454e4438f44e';

export class ContractService {
  private contract: ethers.Contract | null = null;
  private signer: ethers.JsonRpcSigner | null = null;

  async initialize(signer: ethers.JsonRpcSigner) {
    this.signer = signer;
    this.contract = new ethers.Contract(
      CONTRACT_ADDRESS,
      TicketingSFTAbi,
      signer
    );
  }

  async createEvent(
    name: string,
    maxSupply: number,
    price: string,
    maxResalePrice: string
  ) {
    if (!this.contract) throw new Error('Contract not initialized');

    const priceWei = ethers.parseEther(price);
    const maxResalePriceWei = ethers.parseEther(maxResalePrice);

    const tx = await this.contract.createEvent(
      name,
      maxSupply,
      priceWei,
      maxResalePriceWei
    );
    return tx.wait();
  }

  async purchaseTicket(eventId: number, amount: number, price: string) {
    if (!this.contract) throw new Error('Contract not initialized');

    const priceWei = ethers.parseEther(price);
    const totalPrice = priceWei * BigInt(amount);

    const tx = await this.contract.purchaseTicket(eventId, amount, {
      value: totalPrice
    });
    return tx.wait();
  }

  async toggleResaleWindow(eventId: number) {
    if (!this.contract) throw new Error('Contract not initialized');

    const tx = await this.contract.toggleResaleWindow(eventId);
    return tx.wait();
  }

  async listTicketForResale(eventId: number, tokenId: number, price: string) {
    if (!this.contract) throw new Error('Contract not initialized');

    const priceWei = ethers.parseEther(price);
    const tx = await this.contract.listTicketForResale(eventId, tokenId, priceWei);
    return tx.wait();
  }

  async purchaseResaleTicket(eventId: number, tokenId: number, seller: string, price: string) {
    if (!this.contract) throw new Error('Contract not initialized');

    const priceWei = ethers.parseEther(price);
    const tx = await this.contract.purchaseResaleTicket(eventId, tokenId, seller, {
      value: priceWei
    });
    return tx.wait();
  }

  async verifyTicket(eventId: number, ticketId: number) {
    if (!this.contract) throw new Error('Contract not initialized');

    const tx = await this.contract.verifyMyTicket(eventId, ticketId);
    return tx.wait();
  }

  async getEventDetails(eventId: number) {
    if (!this.contract) throw new Error('Contract not initialized');
    return this.contract.events(eventId);
  }
}

export const contractService = new ContractService();