
import { Component, OnInit, ViewChild } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { MatAccordion, MatExpansionPanel } from '@angular/material/expansion';
import { FINAL_ROUND } from 'src/app/models/constants';
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
  eventsByRoundMap = new Map;
  eventIterator!: any;
  events: TournamentEvent[] = [];
  placeOrder: Contestant[] = [];
  bestPresentationWinners: string = '';
  loading!: boolean;
  isFinalRound: boolean = false;
  finalRound = FINAL_ROUND;
  eventsCompletedInFinalRound: number = 0;


  constructor(private firestore: AngularFirestore) { }

  ngOnInit(): void {
    this.getTournamentEvents();
  }

  initializeContestants(): void {
    const tyler: Contestant = { name: 'Tyler', avatar: 'tyler-image', points: 0, ejc: true, isTied: false };
    const shelbie: Contestant = { name: 'Shelbie', avatar: 'shelbie-image', points: 0, ejc: true, isTied: false };
    const victoria: Contestant = { name: 'Victoria', avatar: 'vic-image', points: 0, ejc: true, isTied: false };
    const matt: Contestant = { name: 'Matt', avatar: 'matt-image', points: 0, ejc: true, isTied: false };

    this.contestantMap.set('Tyler', tyler);
    this.contestantMap.set('Shelbie', shelbie);
    this.contestantMap.set('Victoria', victoria);
    this.contestantMap.set('Matt', matt);
  }

  resetValues(): void {
    this.contestantMap = new Map;
    this.initializeContestants();
    this.roundMap = new Map;
    this.tieBreakerMap = new Map;
    this.eventsByRoundMap = new Map;
    this.eventIterator = undefined;
    this.events = [];
    this.placeOrder = [];
    this.bestPresentationWinners = '';
    this.eventsCompletedInFinalRound = 0;
  }

  getTournamentEvents(): void {
    this.loading = true;
    this.firestore.collection("tournamentEvents").valueChanges().subscribe(res => {
      // this.firestore.collection("z-test-tournamentEvents").valueChanges().subscribe(res => {
      this.resetValues();
      this.events = <TournamentEvent[]>res;
      this.calculateScores();
      this.setPlaceOrder();
      this.setSortedEvents();
      this.loading = false;
    });
  }

  calculateScores(): void {
    this.events.forEach(tournamentEvent => {
      this.sortEventByRound(tournamentEvent);
      if (this.isCompletedEvent(tournamentEvent)) {
        this.calculateEventPoints(tournamentEvent);
        this.setTiebreakerValues(tournamentEvent);
        if (tournamentEvent.ejc) {
          tournamentEvent.ejc.forEach(use => {
            this.calculateEJC(use, tournamentEvent);
          });
        }
      } else if (tournamentEvent.bestPresentation && tournamentEvent.bestPresentation.length > 0) {
        this.calculateBestPresentation(tournamentEvent);
      } else if (tournamentEvent.isOvertime) {
        this.calculateOvertimeEventPoints(tournamentEvent);
      }
    });
  }

  sortEventByRound(tournamentEvent: TournamentEvent): void {
    this.setIfFinalRoundComplete(tournamentEvent);
    if (tournamentEvent.round !== 0 && this.eventsByRoundMap.get(tournamentEvent.round)) {
      this.eventsByRoundMap.get(tournamentEvent.round).push(tournamentEvent);
    } else if (tournamentEvent.round !== 0) {
      this.eventsByRoundMap.set(tournamentEvent.round, [tournamentEvent]);
    }
  }

  setIfFinalRoundComplete(tournamentEvent: TournamentEvent): void {
    if(this.isCompletedEvent(tournamentEvent) && tournamentEvent.round === this.finalRound) {
      this.eventsCompletedInFinalRound++;
      if(!tournamentEvent.doubleHeader || this.eventsCompletedInFinalRound >= 2) {
        this.isFinalRound = true;
      }
    }
  }

  isCompletedEvent(tournamentEvent: TournamentEvent): boolean {
    return tournamentEvent.third ? true : false;
  }

  calculateEJC(use: string, tournamentEvent: TournamentEvent): void {
    let contestantToUpdate: Contestant = this.contestantMap.get(use);
    contestantToUpdate.ejc = false;
    this.applyEJCPoints(use, tournamentEvent, contestantToUpdate)
  }

  applyEJCPoints(use: string, tournamentEvent: TournamentEvent, contestant: Contestant): void {
    if (use === tournamentEvent.first) {
      tournamentEvent.firstPoints! += 3;
      contestant.points! += 3;
    } else if (use === tournamentEvent.second) {
      tournamentEvent.secondPoints! -= 2;
      contestant.points! -= 2;
    } else if (use === tournamentEvent.third) {
      tournamentEvent.thirdPoints! += 1;
      contestant.points! += 1;
    }
  }

  setTiebreakerValues(tournamentEvent: TournamentEvent): void {
    this.setIndividualTiebreakerValue(tournamentEvent.first, 'first', tournamentEvent.doubleHeader);
    this.setIndividualTiebreakerValue(tournamentEvent.second, 'second', tournamentEvent.doubleHeader);
    this.setIndividualTiebreakerValue(tournamentEvent.third, 'third', tournamentEvent.doubleHeader);
    this.setIndividualTiebreakerValue(tournamentEvent.fourth, 'fourth', tournamentEvent.doubleHeader);
  }

  setIndividualTiebreakerValue(contestantName: string, place: string, isDoubleHeader: boolean): void {
    let finishes = 0;
    const weightedFinish = isDoubleHeader ? 1 : 2;
    if (this.tieBreakerMap.get(`${contestantName} - ${place}`)) {
      finishes += this.tieBreakerMap.get(`${contestantName} - ${place}`) + weightedFinish;
    } else {
      finishes = weightedFinish;
    }

    this.tieBreakerMap.set(`${contestantName} - ${place}`, finishes);
  }

  calculateEventPoints(tournamentEvent: TournamentEvent): void {
    const firstPoints = tournamentEvent.doubleHeader ? 4 : 8;
    const secondPoints = tournamentEvent.doubleHeader ? 3 : 6;
    const thirdPoints = tournamentEvent.doubleHeader ? 2 : 4;
    const fourthPoints = tournamentEvent.doubleHeader ? 1 : 2;

    const firstPlace = this.contestantMap.get(tournamentEvent.first);
    if (tournamentEvent.host !== firstPlace.name) {
      firstPlace.points! += firstPoints;
      tournamentEvent.firstPoints = firstPoints;
    } else {
      firstPlace.points! += secondPoints;
      tournamentEvent.firstPoints = secondPoints;
    }

    const secondPlace = this.contestantMap.get(tournamentEvent.second);
    secondPlace.points! += secondPoints;
    tournamentEvent.secondPoints = secondPoints;

    const thirdPlace = this.contestantMap.get(tournamentEvent.third);
    thirdPlace.points! += thirdPoints;
    tournamentEvent.thirdPoints = thirdPoints;

    const fourthPlace = this.contestantMap.get(tournamentEvent.fourth);
    fourthPlace.points! += fourthPoints;
    tournamentEvent.fourthPoints = fourthPoints;
  }

  calculateOvertimeEventPoints(tournamentEvent: TournamentEvent): void {
    if(tournamentEvent.first) {
      const firstPlace = this.contestantMap.get(tournamentEvent.first);
      firstPlace.points! += 1;
      tournamentEvent.firstPoints = 1;
    }
  }

  setPlaceOrder(): void {
    const contestants = Array.from(this.contestantMap.values());
    this.placeOrder = this.setTieBreakerOrder(contestants);
  }

  setTieBreakerOrder(contestantNames: Contestant[]): Contestant[] {
    const result = contestantNames.sort((x: Contestant, y: Contestant): number => {
      if (x.points !== y.points) {
        return y.points - x.points;
      }
      if (this.getFinishesForContestant(x.name, 'first') !== this.getFinishesForContestant(y.name, 'first')) {
        return this.compareNumberOfFinishes(this.getFinishesForContestant(x.name, 'first'), this.getFinishesForContestant(y.name, 'first'));
      }
      else if (this.getFinishesForContestant(x.name, 'second') !== this.getFinishesForContestant(y.name, 'second')) {
        return this.compareNumberOfFinishes(this.getFinishesForContestant(x.name, 'second'), this.getFinishesForContestant(y.name, 'second'));
      }
      else if (this.getFinishesForContestant(x.name, 'third') !== this.getFinishesForContestant(y.name, 'third')) {
        return this.compareNumberOfFinishes(this.getFinishesForContestant(x.name, 'third'), this.getFinishesForContestant(y.name, 'third'));
      }
      x.isTied = true;
      y.isTied = true;
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

  setSortedEvents(): void {
    this.eventIterator = Array.from(this.eventsByRoundMap.entries()).sort(function (a, b) { return b[0] - a[0] });
  }

  calculateBestPresentation(tournamentEvent: TournamentEvent): void {
    const numberOfWinners = tournamentEvent.bestPresentation?.length;
    let pointsToAward: number;

    if (numberOfWinners === 1) {
      pointsToAward = 3;
    } else if (numberOfWinners === 2) {
      pointsToAward = 1.5;
    } else {
      pointsToAward = 1;
    }

    let winnerCounter: number = 0;
    tournamentEvent.bestPresentation?.forEach(winner => {
      this.contestantMap.get(winner).points += pointsToAward;
      this.contestantMap.get(winner).isBestPresentation = true;
      let seperator: string = winnerCounter === 0 ? '' : ' , ';
      this.bestPresentationWinners += `${seperator}${winner}`
      winnerCounter++;
    });
  }
}
