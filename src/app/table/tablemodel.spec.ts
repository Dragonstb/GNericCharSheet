import { ElemTypes } from "../elemtypes";
import { TableModel } from "./tablemodel";

describe( 'ValidatorService', () => {
    let elemModel: TableModel;
    const id: string = 'itemmodel123';
    const title: string = 'awesometitle';

    beforeEach(async () => {
        elemModel = new TableModel(id, title);
    });

    // _______________ input validation _______________

    // ... validate widths ...

    it('Validate widths: should accept a proper array', () => {
        const model = {
            minWidth: 10,
            widths: [25, 25, 25, 25]
        }
        expect( elemModel.isProperWidths(model) ).toBeTrue();
    });

    it('Validate widths: should reject model without widths', () => {
        const model = {
            minWidth: 10,
            notwidths: [25, 25, 25, 25]
        }
        expect( elemModel.isProperWidths(model) ).toBeFalse();
    });

    it('Validate widths: should reject model with falsy widths', () => {
        const model = {
            minWidth: 10,
            widths: undefined
        }
        expect( elemModel.isProperWidths(model) ).toBeFalse();
    });

    it('Validate widths: should reject model with non-object widths', () => {
        const model = {
            minWidth: 10,
            widths: 3
        }
        expect( elemModel.isProperWidths(model) ).toBeFalse();
    });

    it('Validate widths: should reject model with non-array widths', () => {
        const model = {
            minWidth: 10,
            widths: {some: 'thing'}
        }
        expect( elemModel.isProperWidths(model) ).toBeFalse();
    });

    it('Validate widths: should reject model with empty widths', () => {
        const model = {
            minWidth: 10,
            widths: []
        }
        expect( elemModel.isProperWidths(model) ).toBeFalse();
    });

    it('Validate widths: should reject model with non-number widths', () => {
        const model = {
            minWidth: 10,
            widths: ['25', '25', '25', '25']
        }
        expect( elemModel.isProperWidths(model) ).toBeFalse();
    });

    it('Validate widths: should reject model with widths below minWidth', () => {
        const model = {
            minWidth: 10,
            widths: [25, 5, 45, 25]
        }
        expect( elemModel.isProperWidths(model) ).toBeFalse();
    });

    it('Validate widths: should reject model with widths above 100', () => {
        const model = {
            minWidth: 10,
            widths: [25, 25, 101, -51]
        }
        expect( elemModel.isProperWidths(model) ).toBeFalse();
    });

    it('Validate widths: should reject model where the widths total above 100', () => {
        const model = {
            minWidth: 10,
            widths: [25, 25, 25, 50]
        }
        expect( elemModel.isProperWidths(model) ).toBeFalse();
    });

    it('Validate widths: should reject model where the widths total below 100', () => {
        const model = {
            minWidth: 10,
            widths: [25]
        }
        expect( elemModel.isProperWidths(model) ).toBeFalse();
    });

    it('Validate widths: should reject a model without minWidth', () => {
        const model = {
            widths: [25, 25, 25, 25]
        }
        expect( elemModel.isProperWidths(model) ).toBeFalse();
    });

    it('Validate widths: should reject a model with falsy minWidth', () => {
        const model = {
            minWidth: undefined,
            widths: [25, 25, 25, 25]
        }
        expect( elemModel.isProperWidths(model) ).toBeFalse();
    });

    it('Validate widths: should reject a model with minWidth of the wrong type', () => {
        const model = {
            minWidth: 'ten',
            widths: [25, 25, 25, 25]
        }
        expect( elemModel.isProperWidths(model) ).toBeFalse();
    });

    it('Validate widths: should reject a model with NaN minWidth', () => {
        const model = {
            minWidth: Number.NaN,
            widths: [25, 25, 25, 25]
        }
        expect( elemModel.isProperWidths(model) ).toBeFalse();
    });

    it('Validate widths: should reject a model with minWidth below unity', () => {
        const model = {
            minWidth: 0,
            widths: [25, 25, 25, 25]
        }
        expect( elemModel.isProperWidths(model) ).toBeFalse();
    });

    // ... validate texts ...

    it('Validate texts: should accept proper texts', () => {
        const arr = [
            ["1-1", "1-2", "1-3"],
            ["2-1", "2-2", "2-3"],
            ["3-1", "3-2", "3-3"],
        ];
        const model = {texts: arr};
        expect( elemModel.isProperTexts(model) ).toBeTrue();
    });

    it('Validate texts: should accept texts with empty strings', () => {
        const arr = [
            ["1-1", "1-2", "1-3"],
            ["2-1", "", "2-3"],
            ["3-1", "3-2", "3-3"],
        ];
        const model = {texts: arr};
        expect( elemModel.isProperTexts(model) ).toBeTrue();
    });

    it('Validate texts: should reject model without texts', () => {
        const arr = [
            ["1-1", "1-2", "1-3"],
            ["2-1", "2-2", "2-3"],
            ["3-1", "3-2", "3-3"],
        ];
        const model = {notextshere: arr};
        expect( elemModel.isProperTexts(model) ).toBeFalse();
    });

    it('Validate texts: should reject model with falsy texts', () => {
        const arr = [
            ["1-1", "1-2", "1-3"],
            ["2-1", "2-2", "2-3"],
            ["3-1", "3-2", "3-3"],
        ];
        const model = {texts: undefined};
        expect( elemModel.isProperTexts(model) ).toBeFalse();
    });

    it('Validate texts: should reject model with non-object texts', () => {
        const arr = [
            ["1-1", "1-2", "1-3"],
            ["2-1", "2-2", "2-3"],
            ["3-1", "3-2", "3-3"],
        ];
        const model = {texts: "anything but love"};
        expect( elemModel.isProperTexts(model) ).toBeFalse();
    });

    it('Validate texts: should reject model with non-array texts', () => {
        const arr = [
            ["1-1", "1-2", "1-3"],
            ["2-1", "2-2", "2-3"],
            ["3-1", "3-2", "3-3"],
        ];
        const model = {texts: {its: "something"}};
        expect( elemModel.isProperTexts(model) ).toBeFalse();
    });

    it('Validate texts: should reject model with falsy rows', () => {
        const arr = [
            undefined,
            undefined,
            undefined,
        ];
        const model = {texts: arr};
        expect( elemModel.isProperTexts(model) ).toBeFalse();
    });

    it('Validate texts: should reject model with non-object rows', () => {
        const arr = [
            1,
            2,
            3,
        ];
        const model = {texts: arr};
        expect( elemModel.isProperTexts(model) ).toBeFalse();
    });

    it('Validate texts: should reject model with non-array rows', () => {
        const arr = [
            {row: 1},
            {row: 2},
            {row: 3},
        ];
        const model = {texts: arr};
        expect( elemModel.isProperTexts(model) ).toBeFalse();
    });

    it('Validate texts: should reject model with falsy entries', () => {
        const arr = [
            ["1-1", "1-2", "1-3"],
            ["2-1", undefined, "2-3"],
            ["3-1", "3-2", "3-3"],
        ];
        const model = {texts: arr};
        expect( elemModel.isProperTexts(model) ).toBeFalse();
    });

    it('Validate texts: should reject model with non-string entries', () => {
        const arr = [
            ["1-1", "1-2", "1-3"],
            ["2-1", 1, "2-3"],
            ["3-1", "3-2", "3-3"],
        ];
        const model = {texts: arr};
        expect( elemModel.isProperTexts(model) ).toBeFalse();
    });

    it('Validate texts: should reject model with rows of different length', () => {
        const arr = [
            ["1-1", "1-2", "1-3"],
            ["2-1", "2-2", "2-3"],
            ["3-1", "3-2"],
        ];
        const model = {texts: arr};
        expect( elemModel.isProperTexts(model) ).toBeFalse();
    });

    it('Validate texts: should reject model with rows of vanishing length', () => {
        const arr = [
            [],
            [],
            [],
        ];
        const model = {texts: arr};
        expect( elemModel.isProperTexts(model) ).toBeFalse();
    });

    // ..... validate model .....

    it('Model validation: should accept a proper model', () => {
        const model = {
            id: id,
            type: ElemTypes.table,
            title: title,
            widths: [50, 50],
            minWidth: 10,
            texts: [
                ['r1c1', 'r1c2'],
                ['r2c1', 'r2c2'],
            ]
        }
        expect( elemModel.validateModel(model) ).toBeTrue();
    });

    // ..... id problems .....

    it('Model validation: should reject a model without id', () => {
        const model = {
            type: ElemTypes.table,
            title: title,
            widths: [50, 50],
            minWidth: 10,
            texts: [
                ['r1c1', 'r1c2'],
                ['r2c1', 'r2c2'],
            ]
        }
        expect( elemModel.validateModel(model) ).toBeFalse();
    });

    it('Model validation: should reject a model with falsy id', () => {
        const model = {
            id: undefined,
            type: ElemTypes.table,
            title: title,
            widths: [50, 50],
            minWidth: 10,
            texts: [
                ['r1c1', 'r1c2'],
                ['r2c1', 'r2c2'],
            ]
        }
        expect( elemModel.validateModel(model) ).toBeFalse();
    });

    it('Model validation: should reject a model with empty id', () => {
        const model = {
            id: '',
            type: ElemTypes.table,
            title: title,
            widths: [50, 50],
            minWidth: 10,
            texts: [
                ['r1c1', 'r1c2'],
                ['r2c1', 'r2c2'],
            ]
        }
        expect( elemModel.validateModel(model) ).toBeFalse();
    });

    it('Model validation: should reject a model with id of the wrong type', () => {
        const model = {
            id: 3,
            type: ElemTypes.table,
            title: title,
            widths: [50, 50],
            minWidth: 10,
            texts: [
                ['r1c1', 'r1c2'],
                ['r2c1', 'r2c2'],
            ]
        }
        expect( elemModel.validateModel(model) ).toBeFalse();
    });

    it('Model validation: should reject a model with a different id', () => {
        const model = {
            id: id+'toomuch',
            type: ElemTypes.table,
            title: title,
            widths: [50, 50],
            minWidth: 10,
            texts: [
                ['r1c1', 'r1c2'],
                ['r2c1', 'r2c2'],
            ]
        }
        expect( elemModel.validateModel(model) ).toBeFalse();
    });

    // ..... type problems .....

    it('Model validation: should reject a model without type', () => {
        const model = {
            id: id,
            title: title,
            widths: [50, 50],
            minWidth: 10,
            texts: [
                ['r1c1', 'r1c2'],
                ['r2c1', 'r2c2'],
            ]
        }
        expect( elemModel.validateModel(model) ).toBeFalse();
    });

    it('Model validation: should reject a model with different type', () => {
        const model = {
            id: id,
            type: ElemTypes.rpm,
            title: title,
            widths: [50, 50],
            minWidth: 10,
            texts: [
                ['r1c1', 'r1c2'],
                ['r2c1', 'r2c2'],
            ]
        }
        expect( elemModel.validateModel(model) ).toBeFalse();
    });

    it('Model validation: should reject a model with type of wrong type', () => {
        const model = {
            id: id,
            type: 3,
            title: title,
            widths: [50, 50],
            minWidth: 10,
            texts: [
                ['r1c1', 'r1c2'],
                ['r2c1', 'r2c2'],
            ]
        }
        expect( elemModel.validateModel(model) ).toBeFalse();
    });

    it('Model validation: should reject a model with falsy type', () => {
        const model = {
            id: id,
            type: '',
            title: title,
            widths: [50, 50],
            minWidth: 10,
            texts: [
                ['r1c1', 'r1c2'],
                ['r2c1', 'r2c2'],
            ]
        }
        expect( elemModel.validateModel(model) ).toBeFalse();
    });

    // ..... title problems .....

    it('Model validation: should reject a model without title', () => {
        const model = {
            id: id,
            type: ElemTypes.table,
            widths: [50, 50],
            minWidth: 10,
            texts: [
                ['r1c1', 'r1c2'],
                ['r2c1', 'r2c2'],
            ]
        }
        expect( elemModel.validateModel(model) ).toBeFalse();
    });

    it('Model validation: should reject a model with falsy title', () => {
        const model = {
            id: id,
            type: ElemTypes.table,
            title: undefined,
            widths: [50, 50],
            minWidth: 10,
            texts: [
                ['r1c1', 'r1c2'],
                ['r2c1', 'r2c2'],
            ]
        }
        expect( elemModel.validateModel(model) ).toBeFalse();
    });

    it('Model validation: should reject a model with title of a wrong type', () => {
        const model = {
            id: id,
            type: ElemTypes.table,
            title: 3,
            widths: [50, 50],
            minWidth: 10,
            texts: [
                ['r1c1', 'r1c2'],
                ['r2c1', 'r2c2'],
            ]
        }
        expect( elemModel.validateModel(model) ).toBeFalse();
    });

    it('Model validation: should accept a model with empty title', () => {
        const model = {
            id: id,
            type: ElemTypes.table,
            title: '',
            widths: [50, 50],
            minWidth: 10,
            texts: [
                ['r1c1', 'r1c2'],
                ['r2c1', 'r2c2'],
            ]
        }
        expect( elemModel.validateModel(model) ).toBeTrue();
    });

    // ..... minWidth, widths, and texts problems .....

    it('Model validation: should reject a model with invalid minWidth', () => {
        const model = {
            id: id,
            type: ElemTypes.table,
            title: title,
            widths: [50, 50],
            minWidth: -5,
            texts: [
                ['r1c1', 'r1c2'],
                ['r2c1', 'r2c2'],
            ]
        }
        expect( elemModel.validateModel(model) ).toBeFalse();
    });

    it('Model validation: should reject a model with invalid widths', () => {
        const model = {
            id: id,
            type: ElemTypes.table,
            title: title,
            widths: 3,
            minWidth: 10,
            texts: [
                ['r1c1', 'r1c2'],
                ['r2c1', 'r2c2'],
            ]
        }
        expect( elemModel.validateModel(model) ).toBeFalse();
    });

    it('Model validation: should reject a model with invalid texts', () => {
        const model = {
            id: id,
            type: ElemTypes.table,
            title: title,
            widths: [50, 50],
            minWidth: 10,
            texts: undefined
        }
        expect( elemModel.validateModel(model) ).toBeFalse();
    });

});