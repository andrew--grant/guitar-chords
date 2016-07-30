function guitarModel() {
    // todo: reserch: https://en.wikipedia.org/wiki/Tablature
    return {
        chords: [
            /* 
                Shape: 
                First index in sub-array is string number
                Second index in sub-array is the fret to hold (if any, 0 if no hold)
                Play open string = 0 | Dont play this string = -1

                NOTE: Using anything less than 1 as a fret number can cause
                issues issue with non-finger indicators (no-play, open-string etc)
             */
            {
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
                    [19, 2, -1], // todo: why no show? (an a can show in same pos, why not this B? Something to do with being very last fret?
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
            }
        ],
        /* 
            Frets: 
            First index in sub-array is fret number
            Second index in sub-array is any markings (todo: currently not accounting for more than one)
       */
        frets: [
            [1, 3],
            [2, 0],
            [3, 0],
            [4, 0],
            [5, 3],
            [6, 0],
            [7, 0],
            [8, 3],
            [9, 0],
            [10, 0],
            [11, 0],
            [12, 3],
            [13, 0],
            [14, 0],
            [15, 0],
            [16, 3],
            [17, 0],
            [18, 0],
            [19, 0]
        ]
    }

}