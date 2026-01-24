export class GNericSheetPlayerAssignment {
    
    private sheetId: string;
    private playerId: string;

    constructor(sheetId: string, playerId: string) {
        this.sheetId = sheetId;
        this.playerId = playerId;
    }

    getSheetId(): string {
        return this.sheetId;
    }

    getPlayerId(): string {
        return this.playerId;
    }
}