import { ValidatorService } from "../../services/validator";
import { ActionTypes } from "../ActionTypes";
import { GNericCompChapterModel } from "../compchapter/compchaptermodel";
import { ElemTypes } from "../elemtypes";

export class GNericCompendiumModel {

    chapters: GNericCompChapterModel[] = [
        new GNericCompChapterModel('chapter-0', 'Fire magic'),
        new GNericCompChapterModel('chapter-1', 'Cold magic'),
    ];

    getChapterById(id: string): GNericCompChapterModel | undefined {
        for (const chapter of this.chapters) {
            if(chapter.getId() === id) {
                return chapter;
            }
        }

        return undefined;
    }

    addChapter(chapter: GNericCompChapterModel): void {
        // TODO: duplicate key check
        this.chapters.push(chapter);
    }

    deleteChapterById(id: string): boolean {
        for (let idx = 0; idx < this.chapters.length; idx++) {
            const chapter = this.chapters[idx];
            if(chapter.getId() === id) {
                this.chapters.splice(idx, 1);
                return true;
            }
        }

        return false;
    }

    getModel(): object {
        const arr: object[] = [];
        for (const chapter of this.chapters) {
            arr.push(chapter.getModel());
        }

        return {
            type: ElemTypes.compendium,
            chapters: arr
        }
    }

    // _______________  update  _______________

    updateModel(model: any): boolean {
        if(!this.validateBaseModel(model)) {
            return false;
        }

        let ok = false;
        if(model.action === ActionTypes.compendiumupdate) {
            ok = this.updateCompendium(model);
        }
        else if(model.action === ActionTypes.compchapterupdate) {
            if(model.hasOwnProperty('model') && model.model && typeof model.model === 'object') {
                ok = this.updateChapter(model.model);
            }
        }

        return ok;
    }

    updateCompendium(model: any): boolean {
        if(!this.validateCompendiumLevelModel(model)) {
            return false;
        }

        const newChapters: GNericCompChapterModel[] = [];
        for (const chapter of model.chapters) {
            const mod = {...chapter, action: ActionTypes.compchapterupdate};
            const newChapter = new GNericCompChapterModel(mod.id, '');
            const ok = newChapter.updateModel(mod);
            if(!ok) {
                return false;
            }
            newChapters.push(newChapter);
        }

        this.chapters = newChapters;
        return true;
    }

    updateChapter(model: any): boolean {
        if(!ValidatorService.hasNonEmptyStringProperty('id', model)) {
            return false;
        }

        for (const chapter of this.chapters) {
            if(chapter.getId() === model.id) {
                return chapter.updateModel(model);
            }
        }

        return false;
    }

    // _______________  validate  _______________

    validateBaseModel(model: any): boolean {
        if(!ValidatorService.isModel(model)) {
            return false;
        }

        if(!ValidatorService.hasNonEmptyStringProperty('type', model)) {
            return false;
        }

        if(model.type !== ElemTypes.compendium) {
            return false;
        }

        if(!ValidatorService.hasNonEmptyStringProperty('action', model)) {
            return false;
        }

        return true;
    }

    validateCompendiumLevelModel(model: any): boolean {
        if(!model.hasOwnProperty('chapters') || !Array.isArray(model.chapters)) {
            return false;
        }

        const idsInUse: Set<string> = new Set();
        for (const chapter of model.chapters) {
            if(typeof chapter !== 'object') {
                return false;
            }
            if(!ValidatorService.hasNonEmptyStringProperty('id', chapter)) {
                return false;
            }
            if(idsInUse.has(chapter.id)) {
                return false;
            }
            idsInUse.add(chapter.id);
        }

        return true;
    }

}