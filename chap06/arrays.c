/*
 * arrays.c (c) 2018-20 Christopher A. Bohn
 */

#pragma clang diagnostic push
#pragma clang diagnostic ignored "-Wunknown-pragmas"
#pragma ide diagnostic ignored "OCUnusedGlobalDeclarationInspection"
int *get_address(int *foo, long j) {
    return &foo[j];
}

int get_value(int *foo, long j) {
    return foo[j];
}

long nested_array1(long i, long j) {
    long bar[5][7];
    long x=bar[i][j];
    return x;
}

long nested_array2(long i, long j) {
    long bar[5][7];
    return bar[i][j];
}

long dynamic_nested_array(long i, long j, long r, long c) {
    long baz[r][c];
    long x=baz[i][j];
    return x;
}

long iliffe_vector1(long i, long j, long **baz) {
    long x=baz[i][j];
    return x;
}

long iliffe_vector2(long i, long j, long *baz[]) {
    return baz[i][j];
}

/*
long iterate1() {
    long A[5][7];
    long sum=0;
    for (int i=0; i<5; i++)
        for (int j=0; j<7; j++)
            sum += A[i][j];
    return sum;
}

long iterate2(long **A) {
    long sum=0;
    for (int i=0; i<5; i++)
        for (int j=0; j<7; j++)
            sum += A[i][j];
    return sum;
}
*/
#pragma clang diagnostic pop
