import mongoose from 'mongoose';

const auditSchema = new mongoose.Schema({
  action: String,
  userId: String,
  articleId: Number,
  createdAt: { type: Date, default: Date.now },
});

export const AuditLog = mongoose.model('AuditLog', auditSchema);

export async function recordAudit(action: string, userId: string, articleId: number) {
  return AuditLog.create({ action, userId, articleId });
}

export async function listAudits() {
  return AuditLog.find({});
}
