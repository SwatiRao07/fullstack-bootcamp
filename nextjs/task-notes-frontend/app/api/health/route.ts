import { NextResponse } from 'next/server';

export async function GET() {
  const startTime = Date.now();
  
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    const response = await fetch(`${apiUrl}/tasks`, {
      method: 'HEAD', // Lightweight check
      signal: controller.signal,
      cache: 'no-store'
    }).finally(() => clearTimeout(timeoutId));

    if (!response.ok && response.status !== 401) { // 401 is still "connected" but unauthorized
      throw new Error(`API returned status ${response.status}`);
    }

    const duration = Date.now() - startTime;

    return NextResponse.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      latency: `${duration}ms`,
      api: {
        status: 'connected',
        url: apiUrl,
      },
      environment: process.env.NODE_ENV,
    });
  } catch (error) {
    console.error('[Health Check Failure]:', error);
    
    return NextResponse.json(
      {
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : 'Unknown error',
        api: 'disconnected',
      },
      { status: 503 }
    );
  }
}
