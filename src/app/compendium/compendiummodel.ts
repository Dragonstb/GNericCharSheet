import { ValidatorService } from "../../services/validator";
import { ActionTypes } from "../ActionTypes";
import { GNericCompChapterModel } from "../compchapter/compchaptermodel";
import { ElemTypes } from "../elemtypes";

export class GNericCompendiumModel {

    chapters: GNericCompChapterModel[] = [
        // new GNericCompChapterModel('chapter-0', 'Fire magic'),
        // new GNericCompChapterModel('chapter-1', 'Cold magic'),
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

    // _______________  merge  _______________

    /** Merges 'model' into 'this'.
     * 
     * @param model Json of a compendium model. May or may not contain an action entry, as it is (over)written anyway.
     * @returns If and only if changes are applied, the json of a copy of 'this' just containing the chapters where changes have occured.
     * Else 'null'.
     */
    mergeModel(model: any): object | null {
        if(!this.validateBaseModel(model)) {
            return null;
        }
        
        if(!this.validateCompendiumLevelModel(model)) {
            return null;
        }

        if(model.action !== ActionTypes.contentmerge) {
            return null;
        }

        const idsInUse: Set<string> = new Set();
        this.chapters.forEach(chapter => {
            idsInUse.add(chapter.getId())
        });

        const upsertedChapters: Array<object> = [];

        for (const chapter of model.chapters) {
            if(idsInUse.has(chapter.id)) {
                // merge into existing chapter
                for (const oldChapter of this.chapters) {
                    if(chapter.id === oldChapter.getId()) {
                        const json = {...chapter, action: ActionTypes.contentmerge};
                        const diffModel = oldChapter.mergeModel(json);
                        if(diffModel !== null) {
                            upsertedChapters.push(diffModel);
                        }
                        break;
                    }
                }
            }
            else {
                // add new chapter
                const newChapter: GNericCompChapterModel = new GNericCompChapterModel(chapter.id, chapter.name);
                const json = {...chapter, action: ActionTypes.compchapterupdate};
                const ok = newChapter.updateModel(json);
                if(ok) {
                    this.chapters.push(newChapter);
                    upsertedChapters.push(newChapter.getModel());
                }
            }
        }

        // data reduction to modified chapters
        if(upsertedChapters.length > 0 ) {
            let diffModel = this.getModel();
            diffModel = {...diffModel, chapters: upsertedChapters};
            return diffModel;
        }
        else {
            return null;
        }
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