/**
 * Moro AI Proofreading Service
 * Orchestrates language proofreading through the provider-independent adapter layer.
 * Enforces meaning preservation, spelling/grammar validation, and multi-option review.
 */

import { ProofreadingProvider, ProofreadingOptions, ProofreadingResult } from '../../types/providers';
import { MockProofreadingProvider } from './MockProofreadingProvider';

export class ProofreadingService {
  private static instance: ProofreadingService;
  private provider: ProofreadingProvider;

  private constructor() {
    // In Phase 1: uses the architectural mock provider.
    // Real external providers can be plugged in later without altering the service API.
    this.provider = new MockProofreadingProvider();
  }

  public static getInstance(): ProofreadingService {
    if (!ProofreadingService.instance) {
      ProofreadingService.instance = new ProofreadingService();
    }
    return ProofreadingService.instance;
  }

  public setProvider(newProvider: ProofreadingProvider): void {
    this.provider = newProvider;
  }

  public getProviderName(): string {
    return this.provider.name;
  }

  public async proofreadText(
    text: string,
    options: ProofreadingOptions = { preserveMeaning: true }
  ): Promise<ProofreadingResult> {
    if (!text || !text.trim()) {
      return {
        originalText: '',
        correctedText: '',
        improvements: [],
        detectedLanguage: 'en',
        readabilityScore: 100,
        provider: this.provider.name,
        modelUsed: 'none',
        executionTimeMs: 0,
      };
    }

    return this.provider.proofread(text, options);
  }
}

export const proofreadingService = ProofreadingService.getInstance();
