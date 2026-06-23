import { Article, Space } from './models.js';
import { publishArticleCreated } from './queue.js';
import { uploadAttachment } from './storage.js';

export async function listArticles() {
  return Article.findAll();
}

export async function getArticle(id: number) {
  return Article.findByPk(id);
}

export async function createArticle(title: string, body: string, spaceId: number) {
  const article = (await Article.create({ title, body, spaceId })) as { id: number };
  await uploadAttachment(`${article.id}.md`, body);
  await publishArticleCreated(article.id);
  return article;
}

export async function listSpaces() {
  return Space.findAll();
}
