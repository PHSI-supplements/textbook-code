/*
 * mov.c (c) 2018-24 Christopher A. Bohn
 */

long mov_demo1(long i) {
    return i;
}

int mov_demo2() {
    int i = 3;
    return i;
}

long load_demo(long *i) {
    return *i;
}

long *store_demo() {
    long *i;
    *i = 3;
    return i;
}

long *scalar_demo(long *i) {
    long *j;
    *j = *i;
    return j;
}

struct foo {
    long i;
    long j;
};

long struct_demo(struct foo *bar) {
    return bar->j;
}

long array_demo1(long *i, long j) {
    return i[j];
}

long array_demo2(long *i) {
    return i[3];
}

long array_demo3(long *i, int j) {
    return i[j];
}

long array_demo4(long *i, unsigned int j) {
    return i[j];
}

int array_demo5(int *i, int j) {
    return i[j];
}

long array_of_struct_demo(struct foo *bar, long j) {
    struct foo baz = bar[j];
    return baz.i;
}

long string_demo1(char *i, int j) {
    return i[j];
}

long string_demo2(char *i, unsigned int j) {
    return i[j];
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

short load_short_demo(short *i) {
    return *i;
}

char load_byte_demo(char *i) {
    return *i;
}

char *store_byte_demo(char i) {
    char *j;
    *j = i;
    return j;
}
