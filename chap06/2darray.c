/**
 * 2darray.c (c) 2018-20 Christopher A. Bohn
 *
 * Nested Array Problem Generator
 *
 * 1. Edit to set the values of M and N for the problem
 * 2. Compile with gcc -Og -S 2darray.c
 * 3. Extract foo's assembly code from 2darray.s
 */

#pragma clang diagnostic push
#pragma clang diagnostic ignored "-Wunknown-pragmas"
#pragma ide diagnostic ignored "OCUnusedGlobalDeclarationInspection"
#define M 6
#define N 7

long A[M][N];
long B[N][M];

long foo(long i, long j) {
    return A[i][j] + B[j][i];
}

#pragma clang diagnostic pop
