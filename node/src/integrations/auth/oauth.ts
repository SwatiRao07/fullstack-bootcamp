import 'dotenv/config';
import { logger } from '../utils/logger';

interface TokenResponse {
  access_token: string;
  expires_in: number;
  token_type: string;
}

export class OAuth2Client {
  private cachedToken: string | null = null;
  private expiresAt: number = 0;

  constructor(
    private readonly clientId: string,
    private readonly clientSecret: string,
    private readonly tokenEndpoint: string
  ) {}

  async getToken(): Promise<string> {
    const now = Date.now();
    const REFRESH_MARGIN_MS = 60_000;

    if (this.cachedToken && now < this.expiresAt - REFRESH_MARGIN_MS) {
      logger.debug('Returning cached OAuth2 token');
      return this.cachedToken;
    }

    logger.info({ endpoint: this.tokenEndpoint }, 'Fetching new OAuth2 token');
    const tokenData = await this.requestToken();

    this.cachedToken = tokenData.access_token;
    this.expiresAt = now + tokenData.expires_in * 1_000;

    logger.info({ expiresInMs: tokenData.expires_in * 1_000 }, 'OAuth2 token refreshed');
    return this.cachedToken;
  }

  private async requestToken(): Promise<TokenResponse> {
    await new Promise((r) => setTimeout(r, 100));

    return {
      access_token: `mock_token_${Buffer.from(`${this.clientId}:${Date.now()}`).toString('base64')}`,
      expires_in: 3600,
      token_type: 'Bearer',
    };
  }
}

export const oauthClient = new OAuth2Client(
  process.env.CLIENT_ID ?? 'drill-client-id',
  process.env.CLIENT_SECRET ?? 'drill-client-secret',
  process.env.TOKEN_ENDPOINT ?? 'https://auth.example.com/oauth/token'
);
