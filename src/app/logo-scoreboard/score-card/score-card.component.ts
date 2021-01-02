import { Component, Input, OnInit } from '@angular/core';
import { Contestant } from 'src/app/models/contestant';

@Component({
  selector: 'app-score-card',
  templateUrl: './score-card.component.html',
  styleUrls: ['./score-card.component.scss']
})
export class ScoreCardComponent implements OnInit {
  @Input() contestant = new Contestant;
  @Input() place!: string;
  @Input() isAllContestantsTied!: boolean;
  @Input() isFinalRound: boolean = false;
  constructor() { }

  ngOnInit(): void {
  }

  getEjc(): string {
    return this.contestant.ejc ? 'Juice!' : ''
  }

}
