// ─── Drill Set 3: OAuth2 Client Credentials Flow ─────────────────────────────
import "dotenv/config";
import { logger } from "../utils/logger";

interface TokenResponse {
  access_token: string;
  expires_in: number; // seconds
  token_type: string;
}

/**
 * OAuth2Client — client credentials flow with token caching.
 *
 * Responsibilities:
 *  • Fetches a token from a token endpoint (mocked for the drill).
 *  • Caches the token in-memory.
 *  • Proactively refreshes 60 s before expiry.
 */
export class OAuth2Client {
  private cachedToken: string | null = null;
  private expiresAt: number = 0; // Unix ms

  constructor(
    private readonly clientId: string,
    private readonly clientSecret: string,
    private readonly tokenEndpoint: string,
  ) {}

  /** Returns a valid access token, refreshing early if near expiry. */
  async getToken(): Promise<string> {
    const now = Date.now();
    const REFRESH_MARGIN_MS = 60_000; // refresh 60 s early

    if (this.cachedToken && now < this.expiresAt - REFRESH_MARGIN_MS) {
      logger.debug("Returning cached OAuth2 token");
      return this.cachedToken;
    }

    logger.info({ endpoint: this.tokenEndpoint }, "Fetching new OAuth2 token");
    const tokenData = await this.requestToken();

    this.cachedToken = tokenData.access_token;
    this.expiresAt = now + tokenData.expires_in * 1_000;

    logger.info(
      { expiresInMs: tokenData.expires_in * 1_000 },
      "OAuth2 token refreshed",
    );
    return this.cachedToken;
  }

  /**
   * Mocked token endpoint for the drill.
   * In production, this would be a real POST to `this.tokenEndpoint`
   * with `grant_type=client_credentials` and base64-encoded credentials.
   */
  private async requestToken(): Promise<TokenResponse> {
    // Simulated network round-trip
    await new Promise((r) => setTimeout(r, 100));

    return {
      access_token: `mock_token_${Buffer.from(`${this.clientId}:${Date.now()}`).toString("base64")}`,
      expires_in: 3600, // 1 hour
      token_type: "Bearer",
    };
  }
}

// Singleton — loaded once from .env
export const oauthClient = new OAuth2Client(
  process.env.CLIENT_ID ?? "drill-client-id",
  process.env.CLIENT_SECRET ?? "drill-client-secret",
  process.env.TOKEN_ENDPOINT ?? "https://auth.example.com/oauth/token",
);
