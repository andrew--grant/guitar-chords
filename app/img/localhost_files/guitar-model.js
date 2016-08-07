function guitarModel() {
    // todo: reserch: https://en.wikipedia.org/wiki/Tablature
    // todo: uppercase chord names?
    return {
        chords: [
            /* 
                Shape: 
                First index in sub-array is string number
                Second index in sub-array is the fret to hold (if any, 0 if no hold)
                Play open string = 0 | Dont play this string = -1 | -2 barred

                NOTE: add bars (-2) to first item in shape array, hen use 0 where
                // no fingers are required

                NOTE: Using anything less than 1 as a fret number can cause
                issues issue with non-finger indicators (no-play, open-string etc)
             */
            {
                name: 'c',
                families: ['c', 'd', 'major', 'f#m', 'bm', 'c#m'],
                difficulty: 2, // remove, its just  a case of 'family'
                shape: [
                    [1, 1, 0], // fret, string, finger 0 1 0 2 3
                    [1, 2, 1],
                    [1, 3, 0],
                    [2, 4, 2],
                    [3, 5, 3],
                    [1, 6, -1]
                ]
            }, {
                name: 'e',
                families: ['e', 'a', 'b', 'cm', 'fm', 'gm', 'easy'],
                difficulty: 3,
                shape: [
                    [1, 1, 1],
                    [2, 2, 1],
                    [3, 3, 1],
                    [4, 4, 1],
                    [5, 5, 1],
                    [6, 6, 1]
                ]
            }, {
                name: 'c',
                families: ['a', 'd', 'e', 'f#m', 'bm', 'c#m'],
                difficulty: 2,
                shape: [
                    [1, 1, 0], // fret, string, finger 0 1 0 2 3
                    [1, 2, 1],
                    [1, 3, 0],
                    [2, 4, 2],
                    [3, 5, 3],
                    [1, 6, -1]
                ]
            }, {
                name: 'a',
                families: ['a', 'd', 'e', 'f#m', 'bm', 'c#m', 'easy'],
                difficulty: 2,
                shape: [
                    [3, 1, -1], // fret, string, finger
                    [3, 2, 0],
                    [3, 3, 1],
                    [3, 4, 2],
                    [3, 5, 3],
                    [3, 6, 0]
                ]
            }, {
                name: 'b',
                families: ['a', 'd', 'e', 'f#m', 'bm', 'c#m'],
                difficulty: 2,
                shape: [
                    [18, 1, 0], // fret, string, finger
                    [19, 2, -1],
                    [17, 3, 1],
                    [18, 4, 2],
                    [18, 5, 3],
                    [17, 6, 0]
                ]
            }, {
                name: 'f',
                families: ['a', 'd', 'e', 'f#m', 'bm', 'c#m'],
                difficulty: 2,
                shape: [
                    [11, 1, -1], // fret, string, finger
                    [11, 2, 0],
                    [11, 3, 1],
                    [12, 4, 2],
                    [12, 5, 3],
                    [11, 6, 0]
                ]
            }, {
                name: 'g',
                families: ['g', 'c', 'd', 'em', 'am', 'bm'],
                difficulty: 4,
                shape: [
                    [3, 1, 1],
                    [2, 2, 2],
                    [1, 3, -1],
                    [1, 4, 0],
                    [1, 5, 0],
                    [3, 6, 3]
                ]
            }, {
                name: 'g6', // uses a bar ( -2)
                families: ['a', 'd', 'e', 'f#m', 'bm', 'c#m'],
                difficulty: 2,
                shape: [
                    [7, 1, -2], // fret, string, finger
                    [8, 2, 1],
                    [7, 3, 0],
                    [9, 4, 2],
                    [7, 5, 0],
                    [7, 6, 0]
                ]
            }, {
                name: 'e',
                families: ['e', 'a', 'b', 'cm', 'fm', 'gm'],
                difficulty: 3,
                shape: [
                    [1, 1, 1],
                    [2, 2, 1],
                    [3, 3, 1],
                    [4, 4, 1],
                    [5, 5, 1],
                    [6, 6, 1]
                ]
            }, {
                name: 'c',
                families: ['c', 'f', 'e', 'f#m', 'bm', 'c#m'],
                difficulty: 2,
                shape: [
                    [1, 1, 0], // fret, string, finger 0 1 0 2 3
                    [1, 2, 1],
                    [1, 3, 0],
                    [2, 4, 2],
                    [3, 5, 3],
                    [1, 6, -1]
                ]
            }, {
                name: 'a-maj-7',
                families: ['a', 'd', 'e', 'f#m', 'bm', 'c#m'],
                difficulty: 2,
                shape: [
                    [3, 1, -1], // fret, string, finger
                    [3, 2, 0],
                    [3, 3, 1],
                    [3, 4, 2],
                    [3, 5, 3],
                    [3, 6, 0]
                ]
            }, {
                name: 'f5',
                families: ['a', 'd', 'e', 'f#m', 'bm', 'c#m'],
                difficulty: 2,
                shape: [
                    [18, 1, 0], // fret, string, finger
                    [19, 2, -1],
                    [17, 3, 1],
                    [18, 4, 2],
                    [18, 5, 3],
                    [17, 6, 0]
                ]
            }, {
                name: 'g-maj-7',
                families: ['a', 'd', 'e', 'f#m', 'bm', 'c#m'],
                difficulty: 2,
                shape: [
                    [11, 1, -1], // fret, string, finger
                    [11, 2, 0],
                    [11, 3, 1],
                    [12, 4, 2],
                    [12, 5, 3],
                    [11, 6, 0]
                ]
            }, {
                name: 'g',
                families: ['g', 'c', 'd', 'em', 'am', 'bm'],
                difficulty: 4,
                shape: [
                    [3, 1, 1],
                    [2, 2, 2],
                    [1, 3, -1],
                    [1, 4, 0],
                    [1, 5, 0],
                    [3, 6, 3]
                ]
            }, {
                name: 'g6', // uses a bar ( -2)
                families: ['a', 'd', 'e', 'f#m', 'bm', 'c#m'],
                difficulty: 2,
                shape: [
                    [7, 1, -2], // fret, string, finger
                    [8, 2, 1],
                    [7, 3, 0],
                    [9, 4, 2],
                    [7, 5, 0],
                    [7, 6, 0]
                ]
            }, {
                name: 'e',
                families: ['e', 'a', 'b', 'cm', 'fm', 'gm'],
                difficulty: 3,
                shape: [
                    [1, 1, 1],
                    [2, 2, 1],
                    [3, 3, 1],
                    [4, 4, 1],
                    [5, 5, 1],
                    [6, 6, 1]
                ]
            }, {
                name: 'c',
                families: ['a', 'd', 'e', 'f#m', 'bm', 'c#m'],
                difficulty: 2,
                shape: [
                    [1, 1, 0], // fret, string, finger 0 1 0 2 3
                    [1, 2, 1],
                    [1, 3, 0],
                    [2, 4, 2],
                    [3, 5, 3],
                    [1, 6, -1]
                ]
            }, {
                name: 'a',
                families: ['a', 'd', 'e', 'f#m', 'bm', 'c#m'],
                difficulty: 2,
                shape: [
                    [3, 1, -1], // fret, string, finger
                    [3, 2, 0],
                    [3, 3, 1],
                    [3, 4, 2],
                    [3, 5, 3],
                    [3, 6, 0]
                ]
            }, {
                name: 'b',
                families: ['a', 'd', 'e', 'f#m', 'bm', 'c#m'],
                difficulty: 2,
                shape: [
                    [18, 1, 0], // fret, string, finger
                    [19, 2, -1],
                    [17, 3, 1],
                    [18, 4, 2],
                    [18, 5, 3],
                    [17, 6, 0]
                ]
            }, {
                name: 'f',
                families: ['a', 'd', 'e', 'f#m', 'bm', 'c#m'],
                difficulty: 2,
                shape: [
                    [11, 1, -1], // fret, string, finger
                    [11, 2, 0],
                    [11, 3, 1],
                    [12, 4, 2],
                    [12, 5, 3],
                    [11, 6, 0]
                ]
            }, {
                name: 'c-min-5',
                families: ['g', 'c', 'd', 'em', 'am', 'bm'],
                difficulty: 4,
                shape: [
                    [3, 1, 1],
                    [2, 2, 2],
                    [1, 3, -1],
                    [1, 4, 0],
                    [1, 5, 0],
                    [3, 6, 3]
                ]
            }, {
                name: 'g6', // uses a bar ( -2)
                families: ['a', 'd', 'e', 'f#m', 'bm', 'c#m'],
                difficulty: 2,
                shape: [
                    [7, 1, -2], // fret, string, finger
                    [8, 2, 1],
                    [7, 3, 0],
                    [9, 4, 2],
                    [7, 5, 0],
                    [7, 6, 0]
                ]
            }, {
                name: 'e',
                families: ['e', 'a', 'b', 'cm', 'fm', 'gm'],
                difficulty: 3,
                shape: [
                    [1, 1, 1],
                    [2, 2, 1],
                    [3, 3, 1],
                    [4, 4, 1],
                    [5, 5, 1],
                    [6, 6, 1]
                ]
            }, {
                name: 'c',
                families: ['a', 'd', 'e', 'f#m', 'bm', 'c#m'],
                difficulty: 2,
                shape: [
                    [1, 1, 0], // fret, string, finger 0 1 0 2 3
                    [1, 2, 1],
                    [1, 3, 0],
                    [2, 4, 2],
                    [3, 5, 3],
                    [1, 6, -1]
                ]
            }, {
                name: 'a',
                families: ['a', 'd', 'e', 'f#m', 'bm', 'c#m'],
                difficulty: 2,
                shape: [
                    [3, 1, -1], // fret, string, finger
                    [3, 2, 0],
                    [3, 3, 1],
                    [3, 4, 2],
                    [3, 5, 3],
                    [3, 6, 0]
                ]
            }, {
                name: 'b',
                families: ['a', 'd', 'e', 'f#m', 'bm', 'c#m'],
                difficulty: 2,
                shape: [
                    [18, 1, 0], // fret, string, finger
                    [19, 2, -1],
                    [17, 3, 1],
                    [18, 4, 2],
                    [18, 5, 3],
                    [17, 6, 0]
                ]
            }, {
                name: 'f',
                families: ['a', 'd', 'e', 'f#m', 'bm', 'c#m'],
                difficulty: 2,
                shape: [
                    [11, 1, -1], // fret, string, finger
                    [11, 2, 0],
                    [11, 3, 1],
                    [12, 4, 2],
                    [12, 5, 3],
                    [11, 6, 0]
                ]
            }, {
                name: 'g',
                families: ['g', 'c', 'd', 'em', 'am', 'bm'],
                difficulty: 4,
                shape: [
                    [3, 1, 1],
                    [2, 2, 2],
                    [1, 3, -1],
                    [1, 4, 0],
                    [1, 5, 0],
                    [3, 6, 3]
                ]
            }, {
                name: 'g6', // uses a bar ( -2)
                families: ['a', 'd', 'e', 'f#m', 'bm', 'c#m'],
                difficulty: 2,
                shape: [
                    [7, 1, -2], // fret, string, finger
                    [8, 2, 1],
                    [7, 3, 0],
                    [9, 4, 2],
                    [7, 5, 0],
                    [7, 6, 0]
                ]
            }, {
                name: 'e',
                families: ['e', 'a', 'b', 'cm', 'fm', 'gm'],
                difficulty: 3,
                shape: [
                    [1, 1, 1],
                    [2, 2, 1],
                    [3, 3, 1],
                    [4, 4, 1],
                    [5, 5, 1],
                    [6, 6, 1]
                ]
            }, {
                name: 'c',
                families: ['a', 'd', 'e', 'f#m', 'bm', 'c#m'],
                difficulty: 2,
                shape: [
                    [1, 1, 0], // fret, string, finger 0 1 0 2 3
                    [1, 2, 1],
                    [1, 3, 0],
                    [2, 4, 2],
                    [3, 5, 3],
                    [1, 6, -1]
                ]
            }, {
                name: 'a',
                families: ['a', 'd', 'e', 'f#m', 'bm', 'c#m'],
                difficulty: 2,
                shape: [
                    [3, 1, -1], // fret, string, finger
                    [3, 2, 0],
                    [3, 3, 1],
                    [3, 4, 2],
                    [3, 5, 3],
                    [3, 6, 0]
                ]
            }, {
                name: 'b',
                families: ['a', 'd', 'e', 'f#m', 'bm', 'c#m'],
                difficulty: 2,
                shape: [
                    [18, 1, 0], // fret, string, finger
                    [19, 2, -1],
                    [17, 3, 1],
                    [18, 4, 2],
                    [18, 5, 3],
                    [17, 6, 0]
                ]
            }
        ],
        /* 
            Frets: 
            First index in sub-array is fret number
            Second index in sub-array is any markings (todo: currently not accounting for more than one)
       */
        frets: [
            [1, 0],
            [2, 0],
            [3, 1],
            [4, 0],
            [5, 2],
            [6, 0],
            [7, 0],
            [8, 2],
            [9, 0],
            [10, 0],
            [11, 0],
            [12, 0],
            [13, 0],
            [14, 0],
            [15, 1],
            [16, 1],
            [17, 1],
            [18, 0],
            [19, 0],
        ]
    }

}