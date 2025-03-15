/**
 * 2darray.c (c) 2018-24 Christopher A. Bohn
 *
 * Nested Array Problem Generator
 *
 * 1. Edit to set the values of M and N for the problem
 * 2. Compile with gcc -Og -S 2darray.c
 * 3. Extract foo's assembly code from 2darray.s
 */

#define M (5)
#define N (4)

long A[M][N];
long B[N][M];

long nested_global_arrays(long x, long y) {
    return A[x][y] + B[y][x];
}

long nested_arrays_as_arguments(long x, long y, long C[][N], long D[][M]) {
    return C[x][y] + D[y][x];
}

long nested_VLAs(long x, long y, long m, long n, long C[][n], long D[][m]) {
    return C[x][y] + D[y][x];
}
