import { Component, type OnInit, type OnDestroy } from '@angular/core';
import { BoardsService, type Board } from './boards.service';

@Component({
  selector: 'app-boards',
  template: `
    <button (click)="onCreate('New board')">New board</button>
    <ul>
      <li *ngFor="let b of boards" (click)="onOpen(b.id)">{{ b.title }}</li>
    </ul>
  `,
})
export class BoardsComponent implements OnInit, OnDestroy {
  boards: Board[] = [];

  constructor(private boardsService: BoardsService) {}

  // lifecycle_hook — load boards when the view initializes.
  ngOnInit() {
    this.boardsService.listBoards().then((boards) => {
      this.boards = boards;
    });
  }

  ngOnDestroy() {
    this.boards = [];
  }

  // ui_action — create a board.
  onCreate(title: string) {
    this.boardsService.createBoard(title).then((board) => {
      this.boards = [...this.boards, board];
    });
  }

  // ui_action — open a board.
  onOpen(id: string) {
    this.boardsService.getBoard(id).then((board) => {
      console.log('opened', board);
    });
  }

  // ui_action — delete a board.
  onDelete(id: string) {
    this.boardsService.deleteBoard(id).then(() => {
      this.boards = this.boards.filter((b) => b.id !== id);
    });
  }
}
