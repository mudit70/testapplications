import { Table, Column, Model, PrimaryKey, AutoIncrement } from 'sequelize-typescript';

@Table({ tableName: 'articles' })
export class Article extends Model {
  @PrimaryKey @AutoIncrement @Column declare id: number;
  @Column declare title: string;
  @Column declare body: string;
  @Column declare spaceId: number;
}

@Table({ tableName: 'spaces' })
export class Space extends Model {
  @PrimaryKey @AutoIncrement @Column declare id: number;
  @Column declare name: string;
}
