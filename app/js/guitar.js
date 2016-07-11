function guitar() {
    return {
        chords: [
            /* 
                Shape: 
                First index in sub-array is string number
                Second index in sub-array is the fret to hold (if any, 0 if no hold)
             */
            {
                name: 'a',
                families: ['a', 'd', 'e', 'f#m', 'bm', 'c#m'],
                difficulty: 2,
                shape: [
                    [1, 0],
                    [2, 0],
                    [3, 2],
                    [4, 2],
                    [5, 2],
                    [6, 0]
                ]
            },

            {
                name: 'g',
                families: ['g', 'c', 'd', 'em', 'am', 'bm'],
                difficulty: 4,
                shape: [
                    [1, 1],
                    [2, 0],
                    [3, 0],
                    [4, 0],
                    [5, 1],
                    [6, 1]
                ]
            },

            {
                name: 'e',
                families: ['e', 'a', 'b', 'cm', 'fm', 'gm'],
                difficulty: 3,
                shape: [
                    [1, 0],
                    [2, 0],
                    [3, 1],
                    [4, 1],
                    [5, 0],
                    [6, 1]
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