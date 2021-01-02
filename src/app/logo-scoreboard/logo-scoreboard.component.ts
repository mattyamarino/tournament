import { Component, Input, OnInit } from '@angular/core';
import { Contestant } from '../models/contestant';

@Component({
  selector: 'app-logo-scoreboard',
  templateUrl: './logo-scoreboard.component.html',
  styleUrls: ['./logo-scoreboard.component.scss']
})
export class LogoScoreboardComponent implements OnInit {
  @Input() placeOrder: Contestant[] = [];
  @Input() currentRound: number = 0;
  @Input() isFinalRound: boolean = false;
  placeCount: number = 0;
  numberOfContestantsTied: number = 0;
  contestantPositionMap = new Map;
  previousTiedPointsValue!: number;
  isAllContestantsTied: boolean = false;

  constructor() { }

  ngOnInit(): void {
    this.placeOrder.forEach(contestant => {
      this.contestantPositionMap.set(contestant, this.getPlace(contestant)); 
    });
    
   if(this.placeCount === 0) {
     this.isAllContestantsTied = true;
   }
  }
  
  getPlace(contestant: Contestant): string {
    if(contestant.isTied && contestant.points !== this.previousTiedPointsValue) {
      this.placeCount += this.numberOfContestantsTied;
      this.numberOfContestantsTied = 0;
      this.previousTiedPointsValue = contestant.points;
      this.numberOfContestantsTied += 1;
      return this.getPlaceFromNumber(this.placeCount);
    }
    
    if(contestant.isTied && contestant.points === this.previousTiedPointsValue) {
      this.numberOfContestantsTied += 1;
      return this.getPlaceFromNumber(this.placeCount);
    }
  
   this.placeCount += this.numberOfContestantsTied;
   this.numberOfContestantsTied = 0;
   const place = this.getPlaceFromNumber(this.placeCount);
   this.placeCount++;
   return place;
  }

  getPlaceFromNumber(place: number): string {
    switch(place) {
      case 0: 
        return '1st';
      case 1: 
        return '2nd';
      case 2: 
        return '3rd';
      case 3: 
        return '4th';
      default: 
        return '';
    }
  }

}
