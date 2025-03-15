/*
 * degrees_of_parallelizable.c (c) 2018-25 Christopher A. Bohn
 */

#include <assert.h>
#include <stdio.h>
#include <string.h>

int *vector_maximum(int *restrict destination, int const *restrict A, int const *restrict B, int array_length) {
    for (int i = 0; i < array_length; i++) {
        destination[i] = A[i] > B[i] ? A[i] : B[i];
    }
    return destination;
}


int *merge(int *restrict destination, int const *restrict A, int a_length, int const *restrict B, int b_length) {
    int a = 0, b = 0, i = 0;
    int output_length = a_length + b_length;
    while (i < output_length) {
        if (a == a_length) {
            destination[i++] = B[b++];
        } else if (b == b_length) {
            destination[i++] = A[a++];
        } else if (A[a] < B[b]) {
            destination[i++] = A[a++];
        } else {
            destination[i++] = B[b++];
        }
    }
    return destination;
}


int *merge_sort(int *A, int array_length) {
    if (array_length > 1) {
        int left_array_length = array_length / 2;
        int right_array_length = array_length - left_array_length;
        int *sorted_left = merge_sort(A, left_array_length);
        int *sorted_right = merge_sort(A + left_array_length, right_array_length);
        int scratch[array_length];
        merge(scratch, sorted_left, left_array_length, sorted_right, right_array_length);
        memcpy(A, scratch, array_length * sizeof(int));
    }
    return A;
}


void print_arrays(int A[], int a_length, int B[], int b_length, int C[], int c_length) {
    if (A) {
        printf("[");
        for (int a = 0; a < a_length; a++) {
            printf("%d", A[a]);
            if (a != a_length - 1) {
                printf(",");
            } else {
                printf("]\n");
            }
        }
    }
    if (B) {
        printf("[");
        for (int b = 0; b < b_length; b++) {
            printf("%d", B[b]);
            if (b != b_length - 1) {
                printf(",");
            } else {
                printf("]\n");
            }
        }
    }
    if (C) {
        printf("[");
        for (int c = 0; c < c_length; c++) {
            printf("%d", C[c]);
            if (c != c_length - 1) {
                printf(",");
            } else {
                printf("]\n");
            }
        }
    }
}


int main() {
    printf("\nVector Maximum\n");
    int A[] = {1, 3, 5, 7, 9};
    int B[] = {2, 4, 4, 7, 8};
    assert(sizeof(A) / sizeof(int) == sizeof(B) / sizeof(int));
    int D[sizeof(A) / sizeof(int)];
    int *C = vector_maximum(D, A, B, sizeof(D) / sizeof(int));
    print_arrays(A, sizeof(A) / sizeof(int),
                 B, sizeof(B) / sizeof(int),
                 C, sizeof(D) / sizeof(int));

    printf("\nMerge\n");
    int E[] = {2, 4, 8, 9, 15, 20};
    int F[(sizeof(A) + sizeof(E)) / sizeof(int)];
    C = merge(F,
              A, sizeof(A) / sizeof(int),
              E, sizeof(E) / sizeof(int));
    print_arrays(A, sizeof(A) / sizeof(int),
                 E, sizeof(E) / sizeof(int),
                 C, sizeof(F) / sizeof(int));

    printf("\nMergesort\n");

    int G[] = {8, 2, 0, 1, 19, 12};
    print_arrays(G, sizeof(G) / sizeof(int),
                 NULL, 0,
                 NULL, 0);
    merge_sort(G, sizeof(G) / sizeof(int));
    print_arrays(G, sizeof(G) / sizeof(int),
                 NULL, 0,
                 NULL, 0);
    return 0;
}
