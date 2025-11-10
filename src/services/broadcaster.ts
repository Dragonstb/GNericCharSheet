import { Injectable } from "@angular/core";
import { GNericMainComponent } from "../app/app.component";
import OBR from "@owlbear-rodeo/sdk";

@Injectable({providedIn: 'root'})
export class BroadCaster {

    channel: string = 'dev.dragonstb.gnericcharsheet.broadcast';
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

    handleOutgoingMessage(msg: object) {
        if(this.ready) {
            if(msg) {
                const letter: string = JSON.stringify(msg);
                OBR.broadcast.sendMessage(this.channel, letter);
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
            this.channel,
            (msg) => this.handleIncomingMessage(msg)
        );
    }
}