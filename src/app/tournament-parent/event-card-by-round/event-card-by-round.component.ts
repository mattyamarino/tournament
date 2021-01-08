import { Component, Input, OnInit } from '@angular/core';
import { FINAL_ROUND } from 'src/app/models/constants';
import { TournamentEvent } from 'src/app/models/tournament-event';

@Component({
  selector: 'app-event-card-by-round',
  templateUrl: './event-card-by-round.component.html',
  styleUrls: ['./event-card-by-round.component.scss']
})
export class EventCardByRoundComponent implements OnInit {
  @Input() roundNumber!: number;
  @Input() unfilteredEvents = [];
  @Input() bestPresentationWinners!: string;
  tournamentEvents!: TournamentEvent[];
  finalRound: number = FINAL_ROUND;
  
  constructor() { }

  ngOnInit(): void {
    this.filterEvents();
  }

  filterEvents(): void {
    this.tournamentEvents = this.unfilteredEvents[1];
  }


}
