import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-best-presentation-award',
  templateUrl: './best-presentation-award.component.html',
  styleUrls: ['./best-presentation-award.component.scss']
})
export class BestPresentationAwardComponent implements OnInit {
  @Input() bestPresentationWinners!: string;

  constructor() { }

  ngOnInit(): void {
  }

}
