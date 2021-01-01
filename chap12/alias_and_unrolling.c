#pragma clang diagnostic push
#pragma clang diagnostic ignored "-Wunknown-pragmas"
#pragma ide diagnostic ignored "UnusedLocalVariable"
#pragma ide diagnostic ignored "UnusedValue"
#pragma ide diagnostic ignored "OCUnusedGlobalDeclarationInspection"
/*
 * alias_and_unrolling.c (c) 2018-20 Christopher A. Bohn
 */

#include <stdio.h>
#include <stdlib.h>
#include <time.h>
#include <assert.h>

#define LIMIT 100000000

void reduce_rows1(double *destination_vector, const double *source_matrix, int size) {
    assert(destination_vector != source_matrix);
    for (int i = 0; i < size; i++) {
        destination_vector[i] = 0;
        for (int j = 0; j < size; j++) {
            destination_vector[i] += source_matrix[i * size + j];
        }
    }
}

void reduce_rows2(double *destination_vector, const double *source_matrix, int size) {
    for (int i = 0; i < size; i++) {
        double sum = 0;
        for (int j = 0; j < size; j++) {
            sum += source_matrix[i * size + j];
        }
        destination_vector[i] = sum;
    }
}

void simple_loop() {
    int *A = calloc(LIMIT, sizeof(int));
    int *B = calloc(LIMIT, sizeof(int));
    int *C = calloc(LIMIT, sizeof(int));
    clock_t start, stop;
    start = clock();
    for (int i = 0; i < LIMIT; i++) {
        A[i] = B[i] + C[i];
    }
    stop = clock();
    printf("Simple loop executed in %ld ms\n", 1000 * (stop - start) / CLOCKS_PER_SEC);
    printf("%d\n", A[LIMIT / 2]);
}

void unrolled_loop() {
    int *A = calloc(LIMIT, sizeof(int));
    int *B = calloc(LIMIT, sizeof(int));
    int *C = calloc(LIMIT, sizeof(int));
    clock_t start, stop;
    start = clock();
    int i;
    for (i = 0; i < LIMIT; i += 4) {
        A[i] = B[i] + C[i];
        A[i + 1] = B[i + 1] + C[i + 1];
        A[i + 2] = B[i + 2] + C[i + 2];
        A[i + 3] = B[i + 3] + C[i + 3];
    }
    if (i != LIMIT)
        for (i -= 4; i < LIMIT; i++) {
            A[i] = B[i] + C[i];
        }
    stop = clock();
    printf("Unrolled loop executed in %ld ms\n", 1000 * (stop - start) / CLOCKS_PER_SEC);
    printf("%d\n", A[LIMIT / 2]);
}


int main() {
    double my_vector[] = {0.0, 0.0};
    double my_matrix[] = {2.0, 3.0, 4.0, 5.0};
//    reduce_rows1(my_vector, my_matrix, 2);
//    reduce_rows1(my_matrix, my_matrix, 2);
//    reduce_rows2(my_matrix, my_matrix, 2);
    simple_loop();
    unrolled_loop();
    return 0;
}

#pragma clang diagnostic pop