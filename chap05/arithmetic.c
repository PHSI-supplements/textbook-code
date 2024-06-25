/*
 * arithmetic.c (c) 2018-20 Christopher A. Bohn
 */

long *lea_demo1(long *i, long j) {
    return &i[j];
}

long lea_demo2(long i) {
    return 48 * i;
}

long lea_demo3(long i, long j) {
    return i + j;
}

long add_demo(long *i, long j) {
    return *i + j;
}

long sub_demo(long *i, long j) {
    return *i - j;
}

long mul_demo(long *i, long j) {
    return *i * j;
}

long div_demo(long *i, long j) {
    return *i / j;
}

long modulo_demo(long *i, long j) {
    return *i % j;
}

long source2_demo1(long i, long j) {
    return i & j;
}

long source2_demo2(long i) {
    return 0x1F & i;
}

long source2_demo3(long i, long j) {
    return i & (j << 4);
}

long iterate(long *i, long max) {
    long sum = 0;
    for (int j = 0; j < max; j++) {
        sum += i[j];
    }
    return sum;
}

long shift(long i, long j) {
    return i + (j << 12);
}

long othershift(long i, long j) {
    return i + (j >> 12);
}

long yetanothershift(long i, unsigned long j) {
    return i + (j >> 12);
}

long shift_instruction(long i, long j) {
    return i >> j;
}

long subtract_from_immediate(long i) {
    return 438 - i;
}

long shift_division(long i) {
    return i / 8;
}

long not_demo(long i) {
    return ~i;
}

long shifted_not_demo1(long i) {
    return ~(i << 3);
}

long shifted_not_demo2(long i) {
    return (~i) << 3;
}
