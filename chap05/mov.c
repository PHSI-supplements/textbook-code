#pragma clang diagnostic push
#pragma clang diagnostic ignored "-Wunknown-pragmas"
#pragma ide diagnostic ignored "OCUnusedGlobalDeclarationInspection"
#pragma clang diagnostic ignored "-Wuninitialized"
#pragma ide diagnostic ignored "readability-non-const-parameter"

/*
 * mov.c (c) 2018-20 Christopher A. Bohn
 */

long mov_demo1(long i) {
    return i;
}

int mov_demo2() {
    int i = 3;
    return i;
}

long mov_demo3(long *i) {
    return *i;
}

long *mov_demo4() {
    long *i;
    *i = 3;
    return i;
}

long *mov_demo5(long *i) {
    long *j;
    *j = *i;
    return j;
}

struct foo {
    long i;
    long j;
};

long mov_demo6(struct foo *bar) {
    return bar->j;
}

long mov_demo7(long *i, long j) {
    return i[j];
}

long mov_demo8(long *i) {
    return i[3];
}

long mov_demo9(long *i, int j) {
    return i[j];
}

long mov_demo10(long *i, unsigned int j) {
    return i[j];
}

int mov_demo11(int *i, int j) {
    return i[j];
}

long mov_demo12(struct foo *bar, long j) {
    struct foo baz = bar[j];
    return baz.i;
}

long mov_demo13(char *i, int j) {
    return i[j];
}

long mov_demo14(char *i, unsigned int j) {
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

long ldr_demo(long *i) {
    return *i;
}

short ldrh_demo(short *i) {
    return *i;
}

char ldrb_demo(char *i) {
    return *i;
}

long *str_demo1(long i) {
    long *j;
    *j = i;
    return j;
}

char *stb_demo2(char i) {
    char *j;
    *j = i;
    return j;
}


int main() {
    return 0;
}

#pragma clang diagnostic pop