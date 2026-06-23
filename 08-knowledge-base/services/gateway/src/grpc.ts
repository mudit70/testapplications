import { Server, ServerCredentials } from '@grpc/grpc-js';

declare const ArticlesService: unknown;
declare const SpacesService: unknown;

import { listMembers } from './db.js';

function getArticle(call: unknown, cb: unknown) {
  void call;
  void cb;
}

function getSpace(call: unknown, cb: unknown) {
  void call;
  void cb;
}

export function startGrpcServer() {
  const server = new Server();
  server.addService(ArticlesService, {
    GetArticle: getArticle,
    ListArticles: async (call: unknown, cb: unknown) => {
      void call;
      void (await listMembers());
      void cb;
    },
  });
  server.addService(SpacesService, {
    GetSpace: getSpace,
  });
  server.bindAsync('0.0.0.0:50051', ServerCredentials.createInsecure(), () => {});
}
