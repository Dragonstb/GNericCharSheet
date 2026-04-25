import { Injectable } from "@angular/core";
import { GNericMainComponent } from "../app/app.component";
import OBR from "@owlbear-rodeo/sdk";

@Injectable({providedIn: 'root'})
export class BroadCaster {

    private baseChannel: string = 'dev.dragonstb.gnericcharsheet.broadcast';
    private bcChannel: string = this.baseChannel + '/broadcast';
    private gmGenChannel: string = this.baseChannel + '/gm/general';
    private gmHelloChannel: string = this.baseChannel + '/gm/hello';
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

    /** 
     * 
     * @param msg 
     */
    handleHelloMessage(msg: any): void {
        const checkPattern = /^[\-a-f0-9]+$/;
        if(this.app && msg && msg.hasOwnProperty('data') && msg.data && typeof msg.data === 'string') {
            try {
                const hello: any = JSON.parse(msg.data);
                if(hello.hasOwnProperty('id') && hello.id && typeof hello.id === 'string') {
                    if(checkPattern.test(hello.id)) {
                        this.app.respondOnHello(hello.id);
                    }
                    else {
                        console.log('GNericCharSheet: received invalid player id in hello message');
                    }
                }
            } catch (error) {
                console.log('GNEricCharSheet: error when parsing hello message.');
            }
        }
        else {
            console.log('GNericCharSheet: received invalid message on channel gm/hello.');
        }
    }

    setReady() {
        this.ready = true;
        console.log('ready: '+this.ready);
        OBR.broadcast.onMessage(
            this.getBroadcastChannel(),
            (msg) => this.handleIncomingMessage(msg)
        );
    }

    getBroadcastChannel(): string {
        return this.bcChannel;
    }

    getGmGeneralChannel(): string {
        return this.gmGenChannel;
    }

    getGmHelloChannel(): string {
        return this.gmHelloChannel;
    }

    getPersonalChannelById(playerId: string): string {
        return this.baseChannel + '/player/' + playerId;
    }

    setPersonalChannelById(playerId: string): void {
        this.privateChannel = this.getPersonalChannelById(playerId);
        if(OBR.isReady) {
            OBR.broadcast.onMessage(
                this.privateChannel,
                msg => this.handleIncomingMessage(msg)
            );
        }
        // TODO: unsubscribe former personal channels when this method is called multiple times
    }

    addToAdminChannel(): void {
        if(OBR.isReady && this.app && this.app.isGM()) {
            OBR.broadcast.onMessage(
                this.getGmGeneralChannel(),
                msg => {
                    this.handleIncomingMessage(msg)
                }
            );

            OBR.broadcast.onMessage(
                this.getGmHelloChannel(),
                msg => {
                    this.handleHelloMessage(msg)
                }
            );
        }
    }
}