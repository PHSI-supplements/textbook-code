/*
 * structured_programming.c (c) 2018-20 Christopher A. Bohn
 */

#include <stdbool.h>

long ifonly(long x) {
    long y = 3;
    if (x > 3)
        y = x + 3;
    return x + y;
}

long ifelse(long x) {
    long y = 2;
    if (x > 0)
        y = y + 3;
    else
        y = x * 3;
    y = -y;
    return y;
}

long ifelseifelse(long x, long y) {
    long z;
    if (x > y)
        z = x + 3;
    else if (x < y)
        z = x * 3;
    else
        z = 200;
    z = x + y * z;
    return z;
}

long conditional_assignment(bool condition) {
    return condition ? 5 : 7;
}

long scalar_difference(long x, long y) {
    return x > y ? x - y : y - x;
}

long doloop(/*long x, long y*/) {
    long x = 2;
    long y = 15;
    do {
        x = x + y;
        y = y - 1;
    } while (y > 0);
    return x;
}

long whileloop1(long x, long y) {
    while (y > 0) {
        x = x + y;
        y = y - 1;
    }
    return x;
}

long whileloop2() {
    long x = 2;
    long y = 15;
    while (y > 0) {
        x = x + y;
        y = y - 1;
    }
    return x;
}

long switchcase(long x) {
    long y = 0;
    switch (x) {
        case 0:
            y = -52;
            break;
        case 1:
            y = 52;
            break;
        case 2:
            y = x + 3;
        case 3:
            y = y * y;
            break;
        case 4:
        case 5:
            y = x + y;
            break;
        case 6:
            y = x - y;
            break;
        case 8:
            y = x * x;
            break;
        default:
            y = y - x;
    }
    return x * y;
}

long simplerswitchcase(long x) {
    long y;
    switch(x) {
        case 0: y=52; break;
        case 1: y=50; break;
        case 2: y=48; break;
        case 3: y=46; break;
        case 4: y=44; break;
        case 5: y=42; break;
        case 6: y=40; break;
        case 10: y=38; break;
        case 11: y=36; break;
        case 12: y=34; break;
        case 13: y=32; break;
        case 14: y=30; break;
        case 15: y=28; break;
        case 16: y=26; break;
        default: y=x;
    }
    return y;
}

long briefswitchcase(long x) {
    long y;
    switch(x) {
        case 0: y=52; break;
        case 1: y=50; break;
        case 2: y=48; break;
        case 3: y=46; break;
        case 4: y=44; break;
        case 6: y=40; break;
        case 7: y=38; break;
        default: y=x;
    }
    return y*x;
}

long lengthyswitchcase(long x) {
    long y;
    switch(x) {
        case 0: y=52; break;
        case 1: y=50; break;
        case 2: y=48; break;
        case 3: y=46; break;
        case 4: y=44; break;
        case 5: y=42; break;
        case 6: y=40; break;
        case 10: y=38; break;
        case 11: y=36; break;
        case 12: y=34; break;
        case 13: y=32; break;
        case 14: y=30; break;
        case 15: y=28; break;
        case 16: y=26; break;
        case 30: y=24; break;
        case 31: y=20; break;
        case 32: y=18; break;
        case 33: y=16; break;
        case 34: y=14; break;
        case 35: y=12; break;
        default: y=x;
    }
    return y;
}
