export class Contestant {
     name!: string;
     avatar?: string;
     points!: number;
     ejc?: boolean;
     isTied: boolean = false;
     isBestPresentation?: boolean;
}