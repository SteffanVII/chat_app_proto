const chars = [
    'A',
    '0',
    'B',
    '1',
    'C',
    '2',
    'D',
    '3',
    'E',
    '4',
    'F',
    '5',
    'G',
    '6',
    'H',
    '7',
    'I',
    '8',
    'J',
    '9',
    'K',
    'L',
    'M',
    'N',
    'O',
    'P',
    'Q',
    'R',
    'S',
    'T',
    'U',
    'V',
    'W',
    'X',
    'Y',
    'Z',
]

export default function GenerateId() : Promise<string> {

    let f = true;
    let id = "";

    while( id.length !== 5 ) {
        
        id += chars[Math.ceil(Math.random() * 36) - 1];

    }    

    return new Promise( ( resolve, reject ) => {
        resolve(id)
    } );
}