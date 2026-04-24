### Minor and major updates of elements

Currently, when changing the name of a character, the action 'sheetupdate' is fired. This action transmits the entire tree of elements of a sheet to the others, where the entire tree
of element models is rebuild. 

Introduce major updates, which is what is done now, and minor updates, where in the example above only data on the sheet level is transmitted and processed. These minor updates do not contain the 'content' in the json.

### More automated tests

For speeding up development, we got a bit sloppy and neglected automated tests except for input validation. Once the beta version is ready, get rid of this debt.

### i18n and l10n ###

For speeding up development, we have skipped internationalization and localization. Once a first stable version exists, get rid of this technical debt.

### a11y ###

Like the multi-language support, accessibility has been neglected for speeding up things. Once a first stable version exists, get rid if this technical debt.

### clean up ###

With the sheet elements, we worked bottom up. On the way, we found our style. Unify naming of common code elements (espeacially in the low-level elements). Also, every element should use the default deletion modal (which also came into existence on our journey). And deletion of elements shall be done by the element one level above (some low-level elements still delete themselves).