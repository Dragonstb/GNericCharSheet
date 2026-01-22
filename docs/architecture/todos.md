### Minor and major updates of elements

Currently, when changing the name of a character, the action 'sheetupdate' is fired. This action transmits the entire tree of elements of a sheet to the others, where the entire tree
of element models is rebuild. 

Introduce major updates, which is what is done now, and minor updates, where in the example above only data on the sheet level is transmitted and processed. These minor updates do not contain the 'content' in the json.