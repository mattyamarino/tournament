import { Component, Input, OnInit } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import { TournamentEvent } from 'src/app/models/tournament-event';

@Component({
  selector: 'app-event-result',
  templateUrl: './event-result.component.html',
  styleUrls: ['./event-result.component.scss']
})
export class EventResultComponent implements OnInit {
  @Input() tournamentEvent!: TournamentEvent;
  displayedColumns: string[] = ['icon', 'position', 'name', 'points', 'ejc'];
  dataSource: any = [];  
  eventBannerUrl!: string;
  titleOverlayUrl!: string;

  constructor(private afStorage: AngularFireStorage) { }

  ngOnInit(): void {
    if (this.tournamentEvent.isOvertime) {
      this.populateOvertimeColumns();
    } else {
      this.populateColumns();
    }
    this.showImage(this.tournamentEvent.eventName!);
    this.getTitleOverlay();
  }

  populateColumns(): void {
    this.dataSource.push({
      position: '1st', name: this.tournamentEvent.first,
      points: this.tournamentEvent.firstPoints, ejc: this.getEjc(this.tournamentEvent.first)
    });
    this.dataSource.push({
      position: '2nd', name: this.tournamentEvent.second,
      points: this.tournamentEvent.secondPoints, ejc: this.getEjc(this.tournamentEvent.second)
    });
    this.dataSource.push({
      position: '3rd', name: this.tournamentEvent.third,
      points: this.tournamentEvent.thirdPoints, ejc: this.getEjc(this.tournamentEvent.third)
    });
    this.dataSource.push({
      position: '4th', name: this.tournamentEvent.fourth,
      points: this.tournamentEvent.fourthPoints, ejc: this.getEjc(this.tournamentEvent.fourth)
    });
  }

  populateOvertimeColumns(): void {
    this.dataSource.push({
      position: '1st', name: this.tournamentEvent.first,
      points: this.tournamentEvent.firstPoints, ejc: this.getEjc(this.tournamentEvent.first)
    });
    this.dataSource.push({
      position: '2nd', name: this.tournamentEvent.second,
      points: this.tournamentEvent.secondPoints, ejc: this.getEjc(this.tournamentEvent.second)
    });
  }

  getPoints(points: number): string {
    const pointsString = points && points !== 1 ? 'pts' : 'pt';
    return points ? `${points}${pointsString}` : '';
  }

  getEjc(name: string): string {
    return this.tournamentEvent.ejc.includes(name) ? 'Juiced!' : '';
  }

  getIcon(positionForIcon: string, element: any): boolean {
    return positionForIcon === element.position ? true : false;
  }

  showImage(eventName: string): void {
    let storageRef = this.afStorage.storage.ref();
    storageRef.child(`${eventName}.jpg`).getDownloadURL().then((url) => {
      this.eventBannerUrl = url;
    }).catch( (error) => {
      this.showImage('default');
    });
  }

  getTitleOverlay(): void {
    const url = '../../../../assets/';
    this.titleOverlayUrl = this.tournamentEvent.eventDescription ? `${url}event-title-with-subtitle.png` : `${url}event-title.png`;
  }

  isCompletedEvent(): boolean {
    return this.tournamentEvent.first ? true : false;
  }

}
