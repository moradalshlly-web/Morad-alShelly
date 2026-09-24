/**
 * Base Provider Architecture
 * Abstract foundation for all media and intelligence providers.
 */

import {
  AIProvider,
  ProviderHealthCheckResult,
  ProviderStatus,
  ProviderType,
} from '../../types/providers';

export abstract class BaseProvider implements AIProvider {
  abstract readonly id: string;
  abstract readonly name: string;
  abstract readonly providerSlug: string;
  abstract readonly supportedTypes: ProviderType[];
  abstract readonly version: string;

  protected apiKey?: string;
  protected baseUrl?: string;

  constructor(apiKey?: string, baseUrl?: string) {
    this.apiKey = apiKey;
    this.baseUrl = baseUrl;
  }

  isConfigured(): boolean {
    return Boolean(this.apiKey && this.apiKey.length > 0);
  }

  async checkHealth(): Promise<ProviderHealthCheckResult> {
    if (!this.isConfigured()) {
      return {
        status: 'unconfigured',
        latencyMs: 0,
        timestamp: new Date().toISOString(),
        errorMessage: 'Provider API key is not configured on the secure server.',
      };
    }

    try {
      const start = performance.now();
      const status = await this.pingEndpoint();
      const latencyMs = Math.round(performance.now() - start);

      return {
        status,
        latencyMs,
        timestamp: new Date().toISOString(),
      };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Health check failed';
      return {
        status: 'offline',
        latencyMs: 0,
        timestamp: new Date().toISOString(),
        errorMessage: message,
      };
    }
  }

  /**
   * Subclasses implement a lightweight ping without generating real media.
   */
  protected abstract pingEndpoint(): Promise<ProviderStatus>;
}
