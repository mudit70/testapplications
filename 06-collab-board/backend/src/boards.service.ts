import { Repository } from 'typeorm';
import { Board, Card } from './entities.js';

// TypeORM-backed data layer. The visitor reads the `Repository<Board>` /
// `Repository<Card>` type annotations to attribute each call to its table.
export class BoardsService {
  constructor(
    private readonly boardRepo: Repository<Board>,
    private readonly cardRepo: Repository<Card>,
  ) {}

  async listBoards(): Promise<Board[]> {
    return this.boardRepo.find();
  }

  async getBoard(id: string): Promise<Board | null> {
    return this.boardRepo.findOne({ where: { id } });
  }

  async createBoard(title: string): Promise<Board> {
    const board = this.boardRepo.create({ title });
    return this.boardRepo.save(board);
  }

  async deleteBoard(id: string): Promise<void> {
    await this.boardRepo.delete({ id });
  }

  async setCover(id: string, coverKey: string): Promise<void> {
    await this.boardRepo.update({ id }, { coverKey });
  }

  async listCards(boardId: string): Promise<Card[]> {
    return this.cardRepo.find({ where: { board: { id: boardId } } });
  }
}
