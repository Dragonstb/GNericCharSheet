import { ActionTypes } from "../ActionTypes";
import { ElemTypes } from "../elemtypes";
import { GNericBlockModel } from "../block/blockmodel";

export class GNericPageModel {

    private id: string;
    private title: string;
    private blocks: GNericBlockModel[] = [];

    constructor(id: string, title: string | undefined) {
        this.id = id;
        this.title = title ?? id;
    }

    getId(): string {
        return this.id;
    }

    getTitle(): string {
        return this.title;
    }

    setTitle(title: string): void {
        this.title = title;
    }

    addBlock(block: GNericBlockModel): void {
        this.blocks.push(block);
    }

    getBlocks(): GNericBlockModel[] {
        return this.blocks;
    }

    setBlocks(newBlocks: GNericBlockModel[]): void {
        this.blocks = newBlocks;
    }

    deleteBlockById(blockId: string): void {
        for (let idx = 0; idx < this.blocks.length; idx++) {
            const block = this.blocks[idx];
            if(block.getId() === blockId) {
                this.blocks.splice(idx, 1);
                break;
            }
        }
    }

    getModel(): object {
        const arr: object[] = [];
        this.blocks.forEach(block => {
            arr.push(
                block.getModel()
            );
        });

        const json = {
            id: this.getId(),
            type: ElemTypes.page,
            action: ActionTypes.pageupdate, // TODO: do not define action here but in surrounding call
            content: arr
        };

        return json;
    }
}