import type { IncomingMessage, ServerResponse } from 'node:http'

export function tryHandleTtsRequest(
  getApiKey: () => string | undefined,
  req: IncomingMessage,
  res: ServerResponse,
): Promise<boolean>
