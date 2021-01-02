export class TournamentEvent {
    eventName?: string;
    eventDescription?: string;
    host?: string;
    ejc!: string[];
    round?: number;
    doubleHeader!: boolean;
    first!: string;
    firstPoints?: number;
    second!: string;
    secondPoints?: number;
    third!: string;
    thirdPoints?: number;
    fourth!: string;
    fourthPoints?: number;
    bestPresentation?: string[];
    isOvertime?: boolean;
}