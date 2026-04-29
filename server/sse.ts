import { Response } from 'express';

/**
 * SSE (Server-Sent Events) Manager
 * Maintains per-slug connection pools and broadcasts events
 * to all connected kiosk and broadcast clients.
 */

type SSEClient = {
    id: string;
    res: Response;
    slug: string;
};

class SSEManager {
    private clients: Map<string, Set<SSEClient>> = new Map();
    private heartbeatInterval: NodeJS.Timeout | null = null;

    constructor() {
        // Heartbeat every 30 seconds to keep connections alive
        this.heartbeatInterval = setInterval(() => {
            this.clients.forEach((clients) => {
                clients.forEach((client) => {
                    try {
                        client.res.write(': heartbeat\n\n');
                    } catch {
                        this.removeClient(client);
                    }
                });
            });
        }, 30_000);
    }

    addClient(slug: string, res: Response): SSEClient {
        const client: SSEClient = {
            id: Math.random().toString(36).slice(2),
            res,
            slug,
        };

        if (!this.clients.has(slug)) {
            this.clients.set(slug, new Set());
        }
        this.clients.get(slug)!.add(client);

        // Clean up on disconnect
        res.on('close', () => this.removeClient(client));

        return client;
    }

    removeClient(client: SSEClient) {
        const slugClients = this.clients.get(client.slug);
        if (slugClients) {
            slugClients.delete(client);
            if (slugClients.size === 0) {
                this.clients.delete(client.slug);
            }
        }
    }

    /**
     * Broadcast an event to all clients watching a specific slug.
     * Data is JSON-serialized automatically.
     */
    broadcast(slug: string, event: string, data: any) {
        const slugClients = this.clients.get(slug);
        if (!slugClients || slugClients.size === 0) return;

        const payload = `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;

        slugClients.forEach((client) => {
            try {
                client.res.write(payload);
            } catch {
                this.removeClient(client);
            }
        });
    }

    getClientCount(slug: string): number {
        return this.clients.get(slug)?.size ?? 0;
    }

    destroy() {
        if (this.heartbeatInterval) {
            clearInterval(this.heartbeatInterval);
        }
        this.clients.clear();
    }
}

// Singleton
export const sseManager = new SSEManager();
