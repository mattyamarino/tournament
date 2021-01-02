import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Contestant } from 'src/app/models/contestant';
import { TournamentEvent } from 'src/app/models/tournament-event';

@Component({
  selector: 'app-tournament-parent',
  templateUrl: './tournament-parent.component.html',
  styleUrls: ['./tournament-parent.component.scss']
})
export class TournamentParentComponent implements OnInit {
  roundMap = new Map;
  contestantMap = new Map;
  tieBreakerMap = new Map;
  events: TournamentEvent[] = [];
  placeOrder: string[] = [];
  loading!: boolean;


  constructor(   private firestore: AngularFirestore   ) {}

  ngOnInit(): void {
    this.initializeContestants();
    this.getTournamentEvents();
  }

  initializeContestants(): void {
    const tyler: Contestant = { name: 'Tyler', avatar: 'tyler-image', points: 0, ejc: true };
    const shelbie: Contestant = { name: 'Shelbie', avatar: 'shelbie-image', points: 0, ejc: true };
    const victoria: Contestant = { name: 'Victoria', avatar: 'vic-image', points: 0, ejc: true };
    const matt: Contestant =  { name: 'Matt', avatar: 'matt-image', points: 0, ejc: true };

    this.contestantMap.set('Tyler', tyler);
    this.contestantMap.set('Shelbie', shelbie);
    this.contestantMap.set('Victoria', victoria);
    this.contestantMap.set('Matt', matt);
  }

  getTournamentEvents(): void { 
    this.loading = true;
    this.firestore.collection("tournamentEvents").valueChanges().subscribe(res => {
      this.events = <TournamentEvent[]>res;
      this.calculateScores();
      this.setPlaceOrder();
      this.loading = false;

    });
  }

  calculateScores(): void {
    this.events.forEach(tournamentEvent => {
      this.calculateEventPoints(tournamentEvent);
      this.setTiebreakerValues(tournamentEvent);
      if (tournamentEvent.ejc) {
        tournamentEvent.ejc.forEach(use => {
          this.calculateEJC(use, tournamentEvent);
        });
      }
    });
  }

  calculateEJC(use: string, tournamentEvent: TournamentEvent): void {
      let contestantToUpdate: Contestant = this.contestantMap.get(use);
      contestantToUpdate.ejc = false;
      this.applyEJCPoints(use, tournamentEvent, contestantToUpdate)
  }

  applyEJCPoints(use: string, tournamentEvent: TournamentEvent, contestant: Contestant): void {
    if(use === tournamentEvent.first) {
      contestant.points! += 3;
    } else if(use === tournamentEvent.second) {
      contestant.points! -= 2;
    } else if(use === tournamentEvent.third) {
      contestant.points! += 1;
    }
  }

  setTiebreakerValues(tournamentEvent: TournamentEvent): void {
    this.setIndividualTiebreakerValue(tournamentEvent.first, 'first');
    this.setIndividualTiebreakerValue(tournamentEvent.second, 'second');
    this.setIndividualTiebreakerValue(tournamentEvent.third, 'third');
    this.setIndividualTiebreakerValue(tournamentEvent.fourth, 'fourth');
  }

  setIndividualTiebreakerValue(contestantName: string, place: string): void {
    let finishes = 0;
    if( this.tieBreakerMap.get(`${contestantName} - ${place}`)) {
      finishes += this.tieBreakerMap.get(`${contestantName} - ${place}`) + 1;
    } else {
      finishes = 1;
    }

    this.tieBreakerMap.set(`${contestantName} - ${place}`, finishes);
  }

  calculateEventPoints(tournamentEvent: TournamentEvent): void {
    const firstPlace = this.contestantMap.get(tournamentEvent.first);
    if(tournamentEvent.host !== firstPlace.name) {
      firstPlace.points! += tournamentEvent.doubleHeader ? 4 : 8;
    } else {
      firstPlace.points! += tournamentEvent.doubleHeader ? 3 : 6;
    }

    const secondPlace = this.contestantMap.get(tournamentEvent.second);
    secondPlace.points! += tournamentEvent.doubleHeader ? 3 : 6;

    const thirdPlace = this.contestantMap.get(tournamentEvent.third);
    thirdPlace.points! += tournamentEvent.doubleHeader ? 2 : 4;

    const fourthPlace = this.contestantMap.get(tournamentEvent.fourth);
    fourthPlace.points! += tournamentEvent.doubleHeader ? 1 : 2;
  }

  setPlaceOrder(): void {
    const placeMap = new Map;
    const contestants  = Array.from(this.contestantMap.values());
    
    // contestants.forEach(contestant => {
    //     if(!placeMap.get(contestant.points)) {
    //       placeMap.set(contestant.points, [contestant.name]);
    //     } else {
    //       placeMap.get(contestant.points).push(contestant.name);
    //     }
    // });

    const sortedPlaces = new Map([...placeMap.entries()].sort(function(a: any, b: any){return b - a})).values();
    
    console.log('BEFORE SORTING', contestants);
    this.getPlaceOrder(contestants);
  }

  getPlaceOrder(sortedPlaces: any): void {
    this.setTieBreakerOrder(sortedPlaces);
    console.log('AFTER SORTING', sortedPlaces);

    // let done: boolean = false;
    
    // while(done === false) {
    //   const contestantNames = sortedPlaces.next().value;
    //   if(contestantNames && contestantNames.length === 1) {
    //     this.contestantMap.get(contestantNames[0]).place = this.placeOrder.length + 1;
    //     this.placeOrder.push(contestantNames[0]);
    //   } else if(contestantNames) {
    //     const tieBreakerOrder = this.setTieBreakerOrder(contestantNames);

    //     tieBreakerOrder.forEach((contestantName: string) => {
    //       this.contestantMap.get(contestantName).place = this.placeOrder.length + 1;
    //       this.placeOrder.push(contestantName);
    //     });
    //   } else {
    //     done = true;
    //   }
    // }
  }

  setTieBreakerOrder(contestantNames: Contestant[]): Contestant[] {
    
    const result =  contestantNames.sort((x: Contestant, y: Contestant): number =>  {
      if(this.getFinishesForContestant(x.name, 'first') !== this.getFinishesForContestant(y.name, 'first')) {
        return this.compareNumberOfFinishes(this.getFinishesForContestant(x.name, 'first'), this.getFinishesForContestant(y.name, 'first'));
      } 
      else if(this.getFinishesForContestant(x.name, 'second') !== this.getFinishesForContestant(y.name, 'second')) {
        return this.compareNumberOfFinishes(this.getFinishesForContestant(x.name, 'second'), this.getFinishesForContestant(y.name, 'second'));
      } 
      else if(this.getFinishesForContestant(x.name, 'third') !== this.getFinishesForContestant(y.name, 'third')) {
        return this.compareNumberOfFinishes(this.getFinishesForContestant(x.name, 'third'), this.getFinishesForContestant(y.name, 'third'));
      } 
    return 0;
    });

    return result
  }

  getFinishesForContestant(contestantName: string, place: string): number {
    return this.tieBreakerMap.get(`${contestantName} - ${place}`) ? this.tieBreakerMap.get(`${contestantName} - ${place}`) : 0;
  }

  compareNumberOfFinishes(x: number, y: number): number {
    if (x > y) {
      return -1;
    }
    if (x < y) {
      return 1;
    }
    return 0;
  }
}
