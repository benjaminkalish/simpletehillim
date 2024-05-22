function tehillimObject(x, i) {
    return {
        text: x,
        perek: i + 1,
        dayMonth: dayMonthFinder(i + 1),
        dayWeek: dayWeekFinder(i + 1),
        sefer: seferFinder(i + 1)
    };
}

function dayMonthFinder(perek) {
    switch (true) {
        case perek <= 9:
            return 1;
        case perek <= 17:
            return 2;
        case perek <= 22:
            return 3;
        case perek <= 28:
            return 4;
        case perek <= 34:
            return 5;
        case perek <= 38:
            return 6;
        case perek <= 43:
            return 7;
        case perek <= 48:
            return 8;
        case perek <= 54:
            return 9;
        case perek <= 59:
            return 10;
        case perek <= 65:
            return 11;
        case perek <= 68:
            return 12;
        case perek <= 71:
            return 13;
        case perek <= 76:
            return 14;
        case perek <= 78:
            return 15;
        case perek <= 82:
            return 16;
        case perek <= 87:
            return 17;
        case perek <= 89:
            return 18;
        case perek <= 96:
            return 19;
        case perek <= 103:
            return 20;
        case perek <= 105:
            return 21;
        case perek <= 107:
            return 22;
        case perek <= 112:
            return 23;
        case perek <= 118:
            return 24;
        case perek <= 119:
            return 25;
        /* case perek <= :
            return 26; */
        case perek <= 134:
            return 27;
        case perek <= 139:
            return 28;
        case perek <= 144:
            return 29;
        default:
            return 30;
    }
}

function dayWeekFinder(perek) {
    switch (true) {
        case perek <= 29:
            return 1;
        case perek <= 50:
            return 2;
        case perek <= 72:
            return 3;
        case perek <= 89:
            return 4;
        case perek <= 106:
            return 5;
        case perek <= 119:
            return 6;
        default:
            return 7;
    }
}

function seferFinder(perek) {
    switch (true) {
        case perek <= 41:
            return 1;
        case perek <= 72:
            return 2;
        case perek <= 89:
            return 3;
        case perek <= 106:
            return 4;
        default:
            return 5;
    }
}

module.exports = tehillimObject;