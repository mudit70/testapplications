import type { EntityManager } from '@mikro-orm/core';
import { SearchEntry } from './entities.js';

export class SearchRepo {
  constructor(private readonly em: EntityManager) {}

  async findAll(): Promise<SearchEntry[]> {
    return this.em.find(SearchEntry, {});
  }

  async query(title: string): Promise<SearchEntry[]> {
    return this.em.find(SearchEntry, { title });
  }

  async index(entry: SearchEntry): Promise<void> {
    return this.em.persistAndFlush(entry);
  }
}
