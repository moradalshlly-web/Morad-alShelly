/**
 * Gemini Provider Adapter (Pluggable Provider Integration)
 * Ready to receive API keys in Phase 2.
 * Moro AI never depends exclusively on this provider; it is strictly an adapter.
 */

import {
  ProviderStatus,
  ProviderType,
  TextGenerationOptions,
  TextGenerationResult,
  TextProvider,
} from '../../../types/providers';
import { BaseProvider } from '../BaseProvider';

export class GeminiProviderAdapter extends BaseProvider implements TextProvider {
  readonly id = 'adapter_gemini_official';
  readonly name = 'Google Gemini Provider Adapter';
  readonly providerSlug = 'gemini';
  readonly supportedTypes: ProviderType[] = ['text'];
  readonly version = '2.4.0';

  constructor(apiKey?: string) {
    super(apiKey || import.meta.env.VITE_GEMINI_API_KEY);
  }

  protected async pingEndpoint(): Promise<ProviderStatus> {
    if (!this.isConfigured()) return 'unconfigured';
    return 'online';
  }

  async generateText(prompt: string, options?: TextGenerationOptions): Promise<TextGenerationResult> {
    if (!this.isConfigured()) {
      throw new Error('Gemini API key is unconfigured. The AI Router will fallback to alternative models.');
    }

    const start = performance.now();
    // Phase 2: Invoke server-side SDK
    return {
      text: `Gemini Orchestration Response: ${prompt}`,
      tokensUsed: { prompt: 100, completion: 150, total: 250 },
      modelUsed: options?.model || 'gemini-1.5-pro',
      provider: this.providerSlug,
      executionTimeMs: Math.round(performance.now() - start),
    };
  }
}
