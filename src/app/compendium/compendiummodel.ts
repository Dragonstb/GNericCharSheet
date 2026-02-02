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
}