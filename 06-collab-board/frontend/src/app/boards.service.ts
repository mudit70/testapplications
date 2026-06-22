import { Injectable } from '@angular/core';

const BASE = '';

export interface Board {
  id: string;
  title: string;
}

// Angular service whose methods make the real HTTP egress via fetch().
// framework-angular attributes the component interactions; framework-fetch
// picks up these callers and the stitcher joins them to the Express routes.
@Injectable({ providedIn: 'root' })
export class BoardsService {
  async listBoards(): Promise<Board[]> {
    const res = await fetch(`${BASE}/api/boards`);
    return res.json();
  }

  async getBoard(id: string): Promise<Board> {
    const res = await fetch(`${BASE}/api/boards/${id}`);
    return res.json();
  }

  async createBoard(title: string): Promise<Board> {
    const res = await fetch(`${BASE}/api/boards`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title }),
    });
    return res.json();
  }

  async deleteBoard(id: string): Promise<void> {
    await fetch(`${BASE}/api/boards/${id}`, { method: 'DELETE' });
  }

  async uploadCover(id: string, file: Blob): Promise<void> {
    await fetch(`${BASE}/api/boards/${id}/cover`, { method: 'POST', body: file });
  }
}
