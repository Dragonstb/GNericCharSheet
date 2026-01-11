import { ElemTypes } from "../elemtypes";
import { RPMModel } from "./rpmmodel";

describe( 'ValidatorService', () => {
    let elemModel: RPMModel;
    const id: string = 'itemmodel123';
    const title: string = 'awesometitle';

    beforeEach(async () => {
        elemModel = new RPMModel(id, title);
    });

    // _______________ input validation _______________

    it('Should accept a proper model', () => {
        const texts = ["one", "two", "three"];
        const rows = texts.length;
        const cols = 5;
        const mapping = {
            a: 1,
            b: 2,
            '': 3
        };
        const damage = [0,2,3,1,0,0];
        const model = {
            id: id,
            type: ElemTypes.rpm,
            rows: rows,
            cols: cols,
            showTexts: true,
            useAbsorbtion: false,
            tierMap: mapping,
            texts: texts,
            damage: damage,
            title: 'Hello'
        };
        expect(elemModel.validateModel(model)).toBeTrue();
    });

    // ..... id problems .....

    it('Should reject a model with wrong id', () => {
        const texts = ["one", "two", "three"];
        const rows = texts.length;
        const cols = 5;
        const mapping = {
            a: 1,
            b: 2,
            '': 3
        };
        const damage = [0,2,3,1,0,0];
        const model = {
            id: id+"hello",
            type: ElemTypes.rpm,
            rows: rows,
            cols: cols,
            showTexts: true,
            useAbsorbtion: false,
            tierMap: mapping,
            texts: texts,
            damage: damage,
            title: 'Hello'
        };
        expect(elemModel.validateModel(model)).toBeFalse();
    });

    it('Should reject a model with falsy id', () => {
        const texts = ["one", "two", "three"];
        const rows = texts.length;
        const cols = 5;
        const mapping = {
            a: 1,
            b: 2,
            '': 3
        };
        const damage = [0,2,3,1,0,0];
        const model = {
            id: undefined,
            type: ElemTypes.rpm,
            rows: rows,
            cols: cols,
            showTexts: true,
            useAbsorbtion: false,
            tierMap: mapping,
            texts: texts,
            damage: damage,
            title: 'Hello'
        };
        expect(elemModel.validateModel(model)).toBeFalse();
    });

    it('Should reject a model with missing id', () => {
        const texts = ["one", "two", "three"];
        const rows = texts.length;
        const cols = 5;
        const mapping = {
            a: 1,
            b: 2,
            '': 3
        };
        const damage = [0,2,3,1,0,0];
        const model = {
            type: ElemTypes.rpm,
            rows: rows,
            cols: cols,
            showTexts: true,
            useAbsorbtion: false,
            tierMap: mapping,
            texts: texts,
            damage: damage,
            title: 'Hello'
        };
        expect(elemModel.validateModel(model)).toBeFalse();
    });

    it('Should reject a model with if of wrong type', () => {
        const texts = ["one", "two", "three"];
        const rows = texts.length;
        const cols = 5;
        const mapping = {
            a: 1,
            b: 2,
            '': 3
        };
        const damage = [0,2,3,1,0,0];
        const model = {
            id: 5,
            type: ElemTypes.rpm,
            rows: rows,
            cols: cols,
            showTexts: true,
            useAbsorbtion: false,
            tierMap: mapping,
            texts: texts,
            damage: damage,
            title: 'Hello'
        };
        expect(elemModel.validateModel(model)).toBeFalse();
    });

    // ..... type problems .....

    it('Should reject a model with wron elem type', () => {
        const texts = ["one", "two", "three"];
        const rows = texts.length;
        const cols = 5;
        const mapping = {
            a: 1,
            b: 2,
            '': 3
        };
        const damage = [0,2,3,1,0,0];
        const model = {
            id: id,
            type: ElemTypes.table,
            rows: rows,
            cols: cols,
            showTexts: true,
            useAbsorbtion: false,
            tierMap: mapping,
            texts: texts,
            damage: damage,
            title: 'Hello'
        };
        expect(elemModel.validateModel(model)).toBeFalse();
    });

    it('Should reject a model with falsy element type', () => {
        const texts = ["one", "two", "three"];
        const rows = texts.length;
        const cols = 5;
        const mapping = {
            a: 1,
            b: 2,
            '': 3
        };
        const damage = [0,2,3,1,0,0];
        const model = {
            id: id,
            type: undefined,
            rows: rows,
            cols: cols,
            showTexts: true,
            useAbsorbtion: false,
            tierMap: mapping,
            texts: texts,
            damage: damage,
            title: 'Hello'
        };
        expect(elemModel.validateModel(model)).toBeFalse();
    });

    it('Should reject a model with missing element type', () => {
        const texts = ["one", "two", "three"];
        const rows = texts.length;
        const cols = 5;
        const mapping = {
            a: 1,
            b: 2,
            '': 3
        };
        const damage = [0,2,3,1,0,0];
        const model = {
            id: id,
            rows: rows,
            cols: cols,
            showTexts: true,
            useAbsorbtion: false,
            tierMap: mapping,
            texts: texts,
            damage: damage,
            title: 'Hello'
        };
        expect(elemModel.validateModel(model)).toBeFalse();
    });

    it('Should reject a model with element type being of the wrong type', () => {
        const texts = ["one", "two", "three"];
        const rows = texts.length;
        const cols = 5;
        const mapping = {
            a: 1,
            b: 2,
            '': 3
        };
        const damage = [0,2,3,1,0,0];
        const model = {
            id: id,
            type: 1,
            rows: rows,
            cols: cols,
            showTexts: true,
            useAbsorbtion: false,
            tierMap: mapping,
            texts: texts,
            damage: damage,
            title: 'Hello'
        };
        expect(elemModel.validateModel(model)).toBeFalse();
    });

    // ..... problems with the number of rows .....

    it('Should reject a model with too few rows', () => {
        const texts: string[] = [];
        const rows = texts.length;
        const cols = 5;
        const mapping = {
            a: 1,
            b: 2,
            '': 3
        };
        const damage = [0,2,3,1,0,0];
        const model = {
            id: id,
            type: ElemTypes.rpm,
            rows: rows,
            cols: cols,
            showTexts: true,
            useAbsorbtion: false,
            tierMap: mapping,
            texts: texts,
            damage: damage,
            title: 'Hello'
        };
        expect(elemModel.validateModel(model)).toBeFalse();
    });

    it('Should reject a model with mismatching number of rows', () => {
        const texts = ["one", "two", "three"];
        const rows = texts.length+2;
        const cols = 5;
        const mapping = {
            a: 1,
            b: 2,
            '': 3
        };
        const damage = [0,2,3,1,0,0];
        const model = {
            id: id,
            type: ElemTypes.rpm,
            rows: rows,
            cols: cols,
            showTexts: true,
            useAbsorbtion: false,
            tierMap: mapping,
            texts: texts,
            damage: damage,
            title: 'Hello'
        };
        expect(elemModel.validateModel(model)).toBeFalse();
    });

    it('Should reject a model with rows having the wrong type', () => {
        const texts = ["one", "two", "three"];
        const rows = String(texts.length);
        const cols = 5;
        const mapping = {
            a: 1,
            b: 2,
            '': 3
        };
        const damage = [0,2,3,1,0,0];
        const model = {
            id: id,
            type: ElemTypes.rpm,
            rows: rows,
            cols: cols,
            showTexts: true,
            useAbsorbtion: false,
            tierMap: mapping,
            texts: texts,
            damage: damage,
            title: 'Hello'
        };
        expect(elemModel.validateModel(model)).toBeFalse();
    });

    it('Should reject a model with falsy number of rows', () => {
        const texts = ["one", "two", "three"];
        const cols = 5;
        const mapping = {
            a: 1,
            b: 2,
            '': 3
        };
        const damage = [0,2,3,1,0,0];
        const model = {
            id: id,
            type: ElemTypes.rpm,
            rows: undefined,
            cols: cols,
            showTexts: true,
            useAbsorbtion: false,
            tierMap: mapping,
            texts: texts,
            damage: damage,
            title: 'Hello'
        };
        expect(elemModel.validateModel(model)).toBeFalse();
    });

    it('Should reject a model with missing number of rows', () => {
        const texts = ["one", "two", "three"];
        const cols = 5;
        const mapping = {
            a: 1,
            b: 2,
            '': 3
        };
        const damage = [0,2,3,1,0,0];
        const model = {
            id: id,
            type: ElemTypes.rpm,
            cols: cols,
            showTexts: true,
            useAbsorbtion: false,
            tierMap: mapping,
            texts: texts,
            damage: damage,
            title: 'Hello'
        };
        expect(elemModel.validateModel(model)).toBeFalse();
    });

    // ..... problems with the number of cols .....

    it('Should reject a model with too few cols', () => {
        const texts = ["one", "two", "three"];
        const rows = texts.length;
        const cols = 0;
        const mapping = {
            a: 1,
            b: 2,
            '': 3
        };
        const damage = [0,2,3,1,0,0];
        const model = {
            id: id,
            type: ElemTypes.rpm,
            rows: rows,
            cols: cols,
            showTexts: true,
            useAbsorbtion: false,
            tierMap: mapping,
            texts: texts,
            damage: damage,
            title: 'Hello'
        };
        expect(elemModel.validateModel(model)).toBeFalse();
    });

    it('Should reject a model with falsy number of cols', () => {
        const texts = ["one", "two", "three"];
        const rows = texts.length;
        const cols = undefined;
        const mapping = {
            a: 1,
            b: 2,
            '': 3
        };
        const damage = [0,2,3,1,0,0];
        const model = {
            id: id,
            type: ElemTypes.rpm,
            rows: rows,
            cols: cols,
            showTexts: true,
            useAbsorbtion: false,
            tierMap: mapping,
            texts: texts,
            damage: damage,
            title: 'Hello'
        };
        expect(elemModel.validateModel(model)).toBeFalse();
    });

    it('Should reject a model with cols of the wrong type', () => {
        const texts = ["one", "two", "three"];
        const rows = texts.length;
        const cols = "many";
        const mapping = {
            a: 1,
            b: 2,
            '': 3
        };
        const damage = [0,2,3,1,0,0];
        const model = {
            id: id,
            type: ElemTypes.rpm,
            rows: rows,
            cols: cols,
            showTexts: true,
            useAbsorbtion: false,
            tierMap: mapping,
            texts: texts,
            damage: damage,
            title: 'Hello'
        };
        expect(elemModel.validateModel(model)).toBeFalse();
    });

    it('Should reject a model with missing number of cols', () => {
        const texts = ["one", "two", "three"];
        const rows = texts.length;
        const mapping = {
            a: 1,
            b: 2,
            '': 3
        };
        const damage = [0,2,3,1,0,0];
        const model = {
            id: id,
            type: ElemTypes.rpm,
            rows: rows,
            showTexts: true,
            useAbsorbtion: false,
            tierMap: mapping,
            texts: texts,
            damage: damage,
            title: 'Hello'
        };
        expect(elemModel.validateModel(model)).toBeFalse();
    });

    // ..... problems with the show-texts toggle .....

    it('Should reject a model with showTexts not being a boolean', () => {
        const texts = ["one", "two", "three"];
        const rows = texts.length;
        const cols = 5;
        const mapping = {
            a: 1,
            b: 2,
            '': 3
        };
        const damage = [0,2,3,1,0,0];
        const model = {
            id: id,
            type: ElemTypes.rpm,
            rows: rows,
            cols: cols,
            showTexts: "yes, please",
            useAbsorbtion: false,
            tierMap: mapping,
            texts: texts,
            damage: damage,
            title: 'Hello'
        };
        expect(elemModel.validateModel(model)).toBeFalse();
    });

    it('Should reject a model with falsy showTexts', () => {
        const texts = ["one", "two", "three"];
        const rows = texts.length;
        const cols = 5;
        const mapping = {
            a: 1,
            b: 2,
            '': 3
        };
        const damage = [0,2,3,1,0,0];
        const model = {
            id: id,
            type: ElemTypes.rpm,
            rows: rows,
            cols: cols,
            showTexts: undefined,
            useAbsorbtion: false,
            tierMap: mapping,
            texts: texts,
            damage: damage,
            title: 'Hello'
        };
        expect(elemModel.validateModel(model)).toBeFalse();
    });

    it('Should reject a model with missing showTexts', () => {
        const texts = ["one", "two", "three"];
        const rows = texts.length;
        const cols = 5;
        const mapping = {
            a: 1,
            b: 2,
            '': 3
        };
        const damage = [0,2,3,1,0,0];
        const model = {
            id: id,
            type: ElemTypes.rpm,
            rows: rows,
            cols: cols,
            useAbsorbtion: false,
            tierMap: mapping,
            texts: texts,
            damage: damage,
            title: 'Hello'
        };
        expect(elemModel.validateModel(model)).toBeFalse();
    });

    // ..... problems with the use-absorption toggle .....

    it('Should reject a model with useAbsorption not bein a boolean', () => {
        const texts = ["one", "two", "three"];
        const rows = texts.length;
        const cols = 5;
        const mapping = {
            a: 1,
            b: 2,
            '': 3
        };
        const damage = [0,2,3,1,0,0];
        const model = {
            id: id,
            type: ElemTypes.rpm,
            rows: rows,
            cols: cols,
            showTexts: true,
            useAbsorbtion: "No no no",
            tierMap: mapping,
            texts: texts,
            damage: damage,
            title: 'Hello'
        };
        expect(elemModel.validateModel(model)).toBeFalse();
    });

    it('Should reject a model with useAbsorption not being defined', () => {
        const texts = ["one", "two", "three"];
        const rows = texts.length;
        const cols = 5;
        const mapping = {
            a: 1,
            b: 2,
            '': 3
        };
        const damage = [0,2,3,1,0,0];
        const model = {
            id: id,
            type: ElemTypes.rpm,
            rows: rows,
            cols: cols,
            showTexts: true,
            useAbsorbtion: undefined,
            tierMap: mapping,
            texts: texts,
            damage: damage,
            title: 'Hello'
        };
        expect(elemModel.validateModel(model)).toBeFalse();
    });

    it('Should reject a model with useAbsorption missing', () => {
        const texts = ["one", "two", "three"];
        const rows = texts.length;
        const cols = 5;
        const mapping = {
            a: 1,
            b: 2,
            '': 3
        };
        const damage = [0,2,3,1,0,0];
        const model = {
            id: id,
            type: ElemTypes.rpm,
            rows: rows,
            cols: cols,
            showTexts: true,
            tierMap: mapping,
            texts: texts,
            damage: damage,
            title: 'Hello'
        };
        expect(elemModel.validateModel(model)).toBeFalse();
    });

    // ..... text problems .....

    it('Should reject a model with at least one text not being a string', () => {
        const texts = ["one", 2, "three"];
        const rows = texts.length;
        const cols = 5;
        const mapping = {
            a: 1,
            b: 2,
            '': 3
        };
        const damage = [0,2,3,1,0,0];
        const model = {
            id: id,
            type: ElemTypes.rpm,
            rows: rows,
            cols: cols,
            showTexts: true,
            useAbsorbtion: false,
            tierMap: mapping,
            texts: texts,
            damage: damage,
            title: 'Hello'
        };
        expect(elemModel.validateModel(model)).toBeFalse();
    });

    it('Should reject a model with texts not being a non-array object', () => {
        const texts = {textA: "one", textB: "two"};
        const rows = 2;
        const cols = 5;
        const mapping = {
            a: 1,
            b: 2,
            '': 3
        };
        const damage = [0,2,3,1,0,0];
        const model = {
            id: id,
            type: ElemTypes.rpm,
            rows: rows,
            cols: cols,
            showTexts: true,
            useAbsorbtion: false,
            tierMap: mapping,
            texts: texts,
            damage: damage,
            title: 'Hello'
        };
        expect(elemModel.validateModel(model)).toBeFalse();
    });

    it('Should reject a model with non-object texts', () => {
        const texts = "just a string";
        const rows = texts.length;
        const cols = 5;
        const mapping = {
            a: 1,
            b: 2,
            '': 3
        };
        const damage = [0,2,3,1,0,0];
        const model = {
            id: id,
            type: ElemTypes.rpm,
            rows: rows,
            cols: cols,
            showTexts: true,
            useAbsorbtion: false,
            tierMap: mapping,
            texts: texts,
            damage: damage,
            title: 'Hello'
        };
        expect(elemModel.validateModel(model)).toBeFalse();
    });

    it('Should reject a model with falsy texts', () => {
        const texts = undefined;
        const rows = 2;
        const cols = 5;
        const mapping = {
            a: 1,
            b: 2,
            '': 3
        };
        const damage = [0,2,3,1,0,0];
        const model = {
            id: id,
            type: ElemTypes.rpm,
            rows: rows,
            cols: cols,
            showTexts: true,
            useAbsorbtion: false,
            tierMap: mapping,
            texts: texts,
            damage: damage,
            title: 'Hello'
        };
        expect(elemModel.validateModel(model)).toBeFalse();
    });

    it('Should reject a model with missing texts', () => {
        const texts = ["one", "two", "three"];
        const rows = texts.length;
        const cols = 5;
        const mapping = {
            a: 1,
            b: 2,
            '': 3
        };
        const damage = [0,2,3,1,0,0];
        const model = {
            id: id,
            type: ElemTypes.rpm,
            rows: rows,
            cols: cols,
            showTexts: true,
            useAbsorbtion: false,
            tierMap: mapping,
            damage: damage,
            title: 'Hello'
        };
        expect(elemModel.validateModel(model)).toBeFalse();
    });

    // ..... damage problems .....

    it('Should reject a model with damage not being a number array', () => {
        const texts = ["one", "two", "three"];
        const rows = texts.length;
        const cols = 5;
        const mapping = {
            a: 1,
            b: 2,
            '': 3
        };
        const damage = [0,2,"three",1,0,0];
        const model = {
            id: id,
            type: ElemTypes.rpm,
            rows: rows,
            cols: cols,
            showTexts: true,
            useAbsorbtion: false,
            tierMap: mapping,
            texts: texts,
            damage: damage,
            title: 'Hello'
        };
        expect(elemModel.validateModel(model)).toBeFalse();
    });

    it('Should reject a model with damages not having the correct length', () => {
        const texts = ["one", "two", "three"];
        const rows = texts.length;
        const cols = 5;
        const mapping = {
            a: 1,
            b: 2,
            '': 3
        };
        const damage = [0,2,3,1,0,0,3];
        const model = {
            id: id,
            type: ElemTypes.rpm,
            rows: rows,
            cols: cols,
            showTexts: true,
            useAbsorbtion: false,
            tierMap: mapping,
            texts: texts,
            damage: damage,
            title: 'Hello'
        };
        expect(elemModel.validateModel(model)).toBeFalse();
    });

    it('Should reject a model with negative damages', () => {
        const texts = ["one", "two", "three"];
        const rows = texts.length;
        const cols = 5;
        const mapping = {
            a: 1,
            b: 2,
            '': 3
        };
        const damage = [0,2,-3,1,0,0];
        const model = {
            id: id,
            type: ElemTypes.rpm,
            rows: rows,
            cols: cols,
            showTexts: true,
            useAbsorbtion: false,
            tierMap: mapping,
            texts: texts,
            damage: damage,
            title: 'Hello'
        };
        expect(elemModel.validateModel(model)).toBeFalse();
    });

    it('Should reject a model with damages not being an array', () => {
        const texts = ["one", "two", "three"];
        const rows = texts.length;
        const cols = 5;
        const mapping = {
            a: 1,
            b: 2,
            '': 3
        };
        const damage = "not much";
        const model = {
            id: id,
            type: ElemTypes.rpm,
            rows: rows,
            cols: cols,
            showTexts: true,
            useAbsorbtion: false,
            tierMap: mapping,
            texts: texts,
            damage: damage,
            title: 'Hello'
        };
        expect(elemModel.validateModel(model)).toBeFalse();
    });

    it('Should reject a model with damage being falsy', () => {
        const texts = ["one", "two", "three"];
        const rows = texts.length;
        const cols = 5;
        const mapping = {
            a: 1,
            b: 2,
            '': 3
        };
        const damage = undefined;
        const model = {
            id: id,
            type: ElemTypes.rpm,
            rows: rows,
            cols: cols,
            showTexts: true,
            useAbsorbtion: false,
            tierMap: mapping,
            texts: texts,
            damage: damage,
            title: 'Hello'
        };
        expect(elemModel.validateModel(model)).toBeFalse();
    });

    it('Should reject a model with missing damage', () => {
        const texts = ["one", "two", "three"];
        const rows = texts.length;
        const cols = 5;
        const mapping = {
            a: 1,
            b: 2,
            '': 3
        };
        const model = {
            id: id,
            type: ElemTypes.rpm,
            rows: rows,
            cols: cols,
            showTexts: true,
            useAbsorbtion: false,
            tierMap: mapping,
            texts: texts,
            title: 'Hello'
        };
        expect(elemModel.validateModel(model)).toBeFalse();
    });

    // ..... problems with the mapping .....

    it('Should reject a model with a mapping of too low tier', () => {
        const texts = ["one", "two", "three"];
        const rows = texts.length;
        const cols = 5;
        const mapping = {
            a: 1,
            b: 0,
            '': 3
        };
        const damage = [0,2,3,1,0,0];
        const model = {
            id: id,
            type: ElemTypes.rpm,
            rows: rows,
            cols: cols,
            showTexts: true,
            useAbsorbtion: false,
            tierMap: mapping,
            texts: texts,
            damage: damage,
            title: 'Hello'
        };
        expect(elemModel.validateModel(model)).toBeFalse();
    });

    it('Should reject a model with a mapping of a too high tier', () => {
        const texts = ["one", "two", "three"];
        const rows = texts.length;
        const cols = 5;
        const mapping = {
            a: 1,
            b: 7,
            '': 3
        };
        const damage = [0,2,3,1,0,0];
        const model = {
            id: id,
            type: ElemTypes.rpm,
            rows: rows,
            cols: cols,
            showTexts: true,
            useAbsorbtion: false,
            tierMap: mapping,
            texts: texts,
            damage: damage,
            title: 'Hello'
        };
        expect(elemModel.validateModel(model)).toBeFalse();
    });

    it('Should reject a model with a mapping od duplicate tiers', () => {
        const texts = ["one", "two", "three"];
        const rows = texts.length;
        const cols = 5;
        const mapping = {
            a: 1,
            b: 2,
            '': 2
        };
        const damage = [0,2,3,1,0,0];
        const model = {
            id: id,
            type: ElemTypes.rpm,
            rows: rows,
            cols: cols,
            showTexts: true,
            useAbsorbtion: false,
            tierMap: mapping,
            texts: texts,
            damage: damage,
            title: 'Hello'
        };
        expect(elemModel.validateModel(model)).toBeFalse();
    });

    it('Should reject a model with a mapping with too long keys', () => {
        const texts = ["one", "two", "three"];
        const rows = texts.length;
        const cols = 5;
        const mapping = {
            a: 1,
            b2: 2,
            '': 3
        };
        const damage = [0,2,3,1,0,0];
        const model = {
            id: id,
            type: ElemTypes.rpm,
            rows: rows,
            cols: cols,
            showTexts: true,
            useAbsorbtion: false,
            tierMap: mapping,
            texts: texts,
            damage: damage,
            title: 'Hello'
        };
        expect(elemModel.validateModel(model)).toBeFalse();
    });

    it('Should reject a model with a mapping of nun-number tiers', () => {
        const texts = ["one", "two", "three"];
        const rows = texts.length;
        const cols = 5;
        const mapping = {
            a: 1,
            b: "two",
            '': 3
        };
        const damage = [0,2,3,1,0,0];
        const model = {
            id: id,
            type: ElemTypes.rpm,
            rows: rows,
            cols: cols,
            showTexts: true,
            useAbsorbtion: false,
            tierMap: mapping,
            texts: texts,
            damage: damage,
            title: 'Hello'
        };
        expect(elemModel.validateModel(model)).toBeFalse();
    });

    it('Should reject a model with a mapping of falsy tier', () => {
        const texts = ["one", "two", "three"];
        const rows = texts.length;
        const cols = 5;
        const mapping = {
            a: 1,
            b: undefined,
            '': 3
        };
        const damage = [0,2,3,1,0,0];
        const model = {
            id: id,
            type: ElemTypes.rpm,
            rows: rows,
            cols: cols,
            showTexts: true,
            useAbsorbtion: false,
            tierMap: mapping,
            texts: texts,
            damage: damage,
            title: 'Hello'
        };
        expect(elemModel.validateModel(model)).toBeFalse();
    });

    it('Should reject a model with a mapping of too many tiers', () => {
        const texts = ["one", "two", "three"];
        const rows = texts.length;
        const cols = 5;
        const mapping = {
            a: 1,
            b: 2,
            '': 3,
            c: 4,
            d: 5,
            e: 6,
            f: 7
        };
        const damage = [0,2,3,1,0,0];
        const model = {
            id: id,
            type: ElemTypes.rpm,
            rows: rows,
            cols: cols,
            showTexts: true,
            useAbsorbtion: false,
            tierMap: mapping,
            texts: texts,
            damage: damage,
            title: 'Hello'
        };
        expect(elemModel.validateModel(model)).toBeFalse();
    });

    it('Should reject a model with a mapping of no tiers', () => {
        const texts = ["one", "two", "three"];
        const rows = texts.length;
        const cols = 5;
        const mapping = {};
        const damage = [0,2,3,1,0,0];
        const model = {
            id: id,
            type: ElemTypes.rpm,
            rows: rows,
            cols: cols,
            showTexts: true,
            useAbsorbtion: false,
            tierMap: mapping,
            texts: texts,
            damage: damage,
            title: 'Hello'
        };
        expect(elemModel.validateModel(model)).toBeFalse();
    });

    it('Should reject a model with a mapping that is not an object ', () => {
        const texts = ["one", "two", "three"];
        const rows = texts.length;
        const cols = 5;
        const mapping = [{a: 1}, {b:2}];
        const damage = [0,2,3,1,0,0];
        const model = {
            id: id,
            type: ElemTypes.rpm,
            rows: rows,
            cols: cols,
            showTexts: true,
            useAbsorbtion: false,
            tierMap: mapping,
            texts: texts,
            damage: damage,
            title: 'Hello'
        };
        expect(elemModel.validateModel(model)).toBeFalse();
    });

    it('Should reject a model with a mapping of different type', () => {
        const texts = ["one", "two", "three"];
        const rows = texts.length;
        const cols = 5;
        const mapping = "a: 1, b: 2";
        const damage = [0,2,3,1,0,0];
        const model = {
            id: id,
            type: ElemTypes.rpm,
            rows: rows,
            cols: cols,
            showTexts: true,
            useAbsorbtion: false,
            tierMap: mapping,
            texts: texts,
            damage: damage,
            title: 'Hello'
        };
        expect(elemModel.validateModel(model)).toBeFalse();
    });

    it('Should reject a model with a mapping of falsiness', () => {
        const texts = ["one", "two", "three"];
        const rows = texts.length;
        const cols = 5;
        const mapping = undefined;
        const damage = [0,2,3,1,0,0];
        const model = {
            id: id,
            type: ElemTypes.rpm,
            rows: rows,
            cols: cols,
            showTexts: true,
            useAbsorbtion: false,
            tierMap: mapping,
            texts: texts,
            damage: damage,
            title: 'Hello'
        };
        expect(elemModel.validateModel(model)).toBeFalse();
    });

    it('Should reject a model with a missing mapping', () => {
        const texts = ["one", "two", "three"];
        const rows = texts.length;
        const cols = 5;
        const damage = [0,2,3,1,0,0];
        const model = {
            id: id,
            type: ElemTypes.rpm,
            rows: rows,
            cols: cols,
            showTexts: true,
            useAbsorbtion: false,
            texts: texts,
            damage: damage,
            title: 'Hello'
        };
        expect(elemModel.validateModel(model)).toBeFalse();
    });

    it('Should reject a model with missing title', () => {
        const texts = ["one", "two", "three"];
        const rows = texts.length;
        const cols = 5;
        const mapping = {
            a: 1,
            b: 2,
            '': 3
        };
        const damage = [0,2,3,1,0,0];
        const model = {
            id: id,
            type: ElemTypes.rpm,
            rows: rows,
            cols: cols,
            showTexts: true,
            useAbsorbtion: false,
            tierMap: mapping,
            texts: texts,
            damage: damage
        };
        expect(elemModel.validateModel(model)).toBeFalse();
    });

    it('Should reject a model with falsy title', () => {
        const texts = ["one", "two", "three"];
        const rows = texts.length;
        const cols = 5;
        const mapping = {
            a: 1,
            b: 2,
            '': 3
        };
        const damage = [0,2,3,1,0,0];
        const model = {
            id: id,
            type: ElemTypes.rpm,
            rows: rows,
            cols: cols,
            showTexts: true,
            useAbsorbtion: false,
            tierMap: mapping,
            texts: texts,
            damage: damage,
            title: undefined
        };
        expect(elemModel.validateModel(model)).toBeFalse();
    });

    it('Should reject a model with title of the wrong type', () => {
        const texts = ["one", "two", "three"];
        const rows = texts.length;
        const cols = 5;
        const mapping = {
            a: 1,
            b: 2,
            '': 3
        };
        const damage = [0,2,3,1,0,0];
        const model = {
            id: id,
            type: ElemTypes.rpm,
            rows: rows,
            cols: cols,
            showTexts: true,
            useAbsorbtion: false,
            tierMap: mapping,
            texts: texts,
            damage: damage,
            title: 5
        };
        expect(elemModel.validateModel(model)).toBeFalse();
    });

    it('Should accept a model with empty title', () => {
        const texts = ["one", "two", "three"];
        const rows = texts.length;
        const cols = 5;
        const mapping = {
            a: 1,
            b: 2,
            '': 3
        };
        const damage = [0,2,3,1,0,0];
        const model = {
            id: id,
            type: ElemTypes.rpm,
            rows: rows,
            cols: cols,
            showTexts: true,
            useAbsorbtion: false,
            tierMap: mapping,
            texts: texts,
            damage: damage,
            title: ''
        };
        expect(elemModel.validateModel(model)).toBeTrue();
    });

});