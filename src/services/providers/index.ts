export * from './BaseProvider';
export * from './adapters/MockProviderAdapter';
export * from './adapters/GeminiProviderAdapter';

import { AIProvider } from '../../types/providers';
import { MockProviderAdapter } from './adapters/MockProviderAdapter';
import { GeminiProviderAdapter } from './adapters/GeminiProviderAdapter';

// Global Provider Adapter Registry
class ProviderRegistry {
  private adapters: Map<string, AIProvider> = new Map();

  constructor() {
    this.register(new MockProviderAdapter());
    this.register(new GeminiProviderAdapter());
  }

  register(adapter: AIProvider) {
    this.adapters.set(adapter.providerSlug, adapter);
  }

  get(providerSlug: string): AIProvider | undefined {
    return this.adapters.get(providerSlug);
  }

  getAll(): AIProvider[] {
    return Array.from(this.adapters.values());
  }
}

export const providerRegistry = new ProviderRegistry();
