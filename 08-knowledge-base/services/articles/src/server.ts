import Koa from 'koa';
import Router from 'koa-router';
import * as service from './service.js';

const app = new Koa();
const router = new Router({ prefix: '/api' });

router.get('/articles', async (ctx) => {
  ctx.body = await service.listArticles();
});

router.get('/articles/:id', async (ctx) => {
  ctx.body = await service.getArticle(Number(ctx.params.id));
});

router.post('/articles', async (ctx) => {
  const { title, body, spaceId } = ctx.request.body as {
    title: string;
    body: string;
    spaceId: number;
  };
  ctx.status = 201;
  ctx.body = await service.createArticle(title, body, spaceId);
});

router.get('/spaces', async (ctx) => {
  ctx.body = await service.listSpaces();
});

app.use(router.routes());
app.use(router.allowedMethods());
app.listen(4001);
