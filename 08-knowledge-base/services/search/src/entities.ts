import { Entity, PrimaryKey, Property } from '@mikro-orm/core';

@Entity({ tableName: 'search_index' })
export class SearchEntry {
  @PrimaryKey() id!: number;
  @Property() articleId!: number;
  @Property() title!: string;
  @Property() content!: string;
}
