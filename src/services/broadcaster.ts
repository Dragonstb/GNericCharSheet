import { Injectable } from "@angular/core";
import { GNericMainComponent } from "../app/app.component";
import OBR from "@owlbear-rodeo/sdk";

@Injectable({providedIn: 'root'})
export class BroadCaster {

    private baseChannel: string = 'dev.dragonstb.gnericcharsheet.broadcast';
    private bcChannel: string = this.baseChannel + '/broadcast';
    private gmGenChannel: string = this.baseChannel + '/gm/general';
    private privateChannel: string | null = null;
    ready: boolean = false;
    app: GNericMainComponent | null = null;

    setApp(app: GNericMainComponent) {
        this.app = app;
    }

    handleIncomingMessage(msg: any) {
        if(this.app && msg && msg.hasOwnProperty('data') && msg.data && typeof msg.data === 'string') {
            try {
                const model: object = JSON.parse(msg.data);
                this.app.setModel(model);
            } catch (error) {
                console.log('Cannot parse message');
            }
        }
        else {
            console.log( this.app ? 'no message' : 'no app');
        }
    }

    handleOutgoingMessage(channel: string, msg: object) {
        if(this.ready) {
            if(msg) {
                const letter: string = JSON.stringify(msg);
                OBR.broadcast.sendMessage(channel, letter);
            }
        }
        else {
            console.log('not ready yet.');
        }
    }

    setReady() {
        this.ready = true;
        console.log('ready: '+this.ready);
        OBR.broadcast.onMessage(
            this.baseChannel,
            (msg) => this.handleIncomingMessage(msg)
        );
        OBR.broadcast.onMessage(
            this.gmGenChannel,
            msg => {
                if(this.app && this.app.isGM()) {
                    this.handleIncomingMessage(msg)
                }
            }
        );
    }

    getGmGeneralChannel(): string {
        return this.gmGenChannel;
    }

    getPersonalChannelById(playerId: string): string {
        return this.baseChannel + '/player/' + playerId;
    }

    setPersonalChannelById(playerId: string): void {
        this.privateChannel = this.baseChannel + '/player/' + playerId;
        if(OBR.isReady) {
            OBR.broadcast.onMessage(
                this.privateChannel,
                msg => this.handleIncomingMessage(msg)
            );
        }
        // TODO: unsubscribe former personal channels when this method is called multiple times
    }
}