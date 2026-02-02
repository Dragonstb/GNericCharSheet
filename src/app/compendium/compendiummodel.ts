import { GNericCompChapterModel } from "../compchapter/compchaptermodel";

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
}