import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ScoringComponent } from './rules/scoring/scoring.component';
import { HostingComponent } from './rules/hosting/hosting.component';
import { WildcardComponent } from './rules/wildcard/wildcard.component';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatCardModule } from '@angular/material/card';
import { LogoScoreboardComponent } from './logo-scoreboard/logo-scoreboard.component';
import { ScoreCardComponent } from './logo-scoreboard/score-card/score-card.component';
import { TournamentParentComponent } from './tournament-parent/tournament-parent/tournament-parent.component';

import { environment } from "src/environments/environment";
import { AngularFireModule } from "@angular/fire";
import { AngularFirestoreModule } from "@angular/fire/firestore";
import { AngularFireStorageModule } from '@angular/fire/storage';
import { EventAdminParentComponent } from './event-admin-parent/event-admin-parent.component';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { EventCardByRoundComponent } from './tournament-parent/event-card-by-round/event-card-by-round.component';
import { EventResultComponent } from './tournament-parent/event-card-by-round/event-result/event-result.component';
import {MatTableModule} from '@angular/material/table';
import { TiebreakersComponent } from './rules/tiebreakers/tiebreakers.component';
import {MatIconModule} from '@angular/material/icon';
import {HttpClientModule} from '@angular/common/http';
import { BestPresentationAwardComponent } from './tournament-parent/event-card-by-round/best-presentation-award/best-presentation-award.component';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import { ContentModalComponent } from './nav-bar/content-modal/content-modal.component';
import {MatDialogModule} from '@angular/material/dialog';
import { RulesContentComponent } from './nav-bar/content-modal/rules-content/rules-content.component';

@NgModule({
  declarations: [
    AppComponent,
    ScoringComponent,
    HostingComponent,
    WildcardComponent,
    LogoScoreboardComponent,
    ScoreCardComponent,
    TournamentParentComponent,
    EventAdminParentComponent,
    EventCardByRoundComponent,
    EventResultComponent,
    TiebreakersComponent,
    BestPresentationAwardComponent,
    NavBarComponent,
    ContentModalComponent,
    RulesContentComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatExpansionModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatTableModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFirestoreModule,
    MatIconModule,
    HttpClientModule,
    AngularFireStorageModule,
    MatDialogModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
