import Hapi from '@hapi/hapi';
import { listMembers, findMember, createMember } from './db.js';
import { listAudits } from './audit.model.js';
import { startGrpcServer } from './grpc.js';

export async function init() {
  const server = Hapi.server({ port: 4000, host: '0.0.0.0' });

  server.route({
    method: 'GET',
    path: '/api/members',
    handler: async (_request, h) => {
      return h.response(await listMembers());
    },
  });

  server.route({
    method: 'GET',
    path: '/api/members/{id}',
    handler: async (request, h) => {
      return h.response(await findMember(Number(request.params.id)));
    },
  });

  server.route({
    method: 'POST',
    path: '/api/members',
    handler: async (request, h) => {
      const { email } = request.payload as { email: string };
      return h.response(await createMember(email)).code(201);
    },
  });

  server.route({
    method: 'GET',
    path: '/api/audits',
    handler: async (_request, h) => {
      return h.response(await listAudits());
    },
  });

  startGrpcServer();
  await server.start();
  return server;
}

init();
