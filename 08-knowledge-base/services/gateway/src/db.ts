import knexFactory from 'knex';

const knex = knexFactory({
  client: 'pg',
  connection: process.env.DATABASE_URL ?? 'postgres://localhost/kb',
});

export async function listMembers() {
  return knex('members').select('*');
}

export async function findMember(id: number) {
  return knex('members').where({ id }).first();
}

export async function createMember(email: string) {
  return knex('members').insert({ email });
}

export async function countArticlesBySpace(spaceId: number) {
  return knex('article_stats').where({ spaceId }).count();
}
