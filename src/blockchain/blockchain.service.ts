// blockchain.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { ethers } from 'ethers';
import { ProviderFactory } from './providers/provider.factory';
import { SupportedChain } from './enums/supported-chain.enum';

@Injectable()
export class BlockchainService {
  private readonly logger = new Logger(BlockchainService.name);
  private providers = new Map<SupportedChain, ethers.JsonRpcProvider>();

  constructor() {
    Object.values(SupportedChain).forEach(chain => {
      this.providers.set(chain, ProviderFactory.create(chain));
    });
  }

  getProvider(chain: SupportedChain) {
    return this.providers.get(chain);
  }

  async getNetworkStatus(chain: SupportedChain) {
    const provider = this.getProvider(chain);
    const block = await provider.getBlockNumber();

    return {
      chain,
      latestBlock: block,
      healthy: true,
    };
  }

  /**
   * Estimate gas for a transaction
   */
  estimateGas(): number {
    // Return estimated gas fee in ETH
    return 0.001; // Example value
  }

  /**
   * Create an escrow wallet address
   */
  async createEscrowWallet(): Promise<string> {
    // Generate a random escrow wallet address
    const wallet = ethers.Wallet.createRandom();
    return wallet.address;
  }

  /**
   * Get transaction receipt from blockchain
   */
  async getTransactionReceipt(txHash: string): Promise<{ confirmations: number }> {
    // Return mock confirmations
    return { confirmations: 6 };
  }
}
