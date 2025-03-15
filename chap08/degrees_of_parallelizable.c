#pragma clang diagnostic push
#pragma clang diagnostic ignored "-Wunknown-pragmas"
#pragma ide diagnostic ignored "OCUnusedGlobalDeclarationInspection"
#pragma ide diagnostic ignored "bugprone-branch-clone"
#pragma ide diagnostic ignored "misc-no-recursion"
/*
 * degrees_of_parallelizable.c (c) 2018-20 Christopher A. Bohn
 */

#include <stdio.h>
#include <stdlib.h>

int *merge(const int A[], int a_length, const int B[], int b_length, int output[]) {
    int a = 0, b = 0, i = 0;
    int output_length = a_length + b_length;
    while (i < output_length) {
        if (a == a_length) {
            output[i++] = B[b++];
        } else if (b == b_length) {
            output[i++] = A[a++];
        } else if (A[a] < B[b]) {
            output[i++] = A[a++];
        } else {
            output[i++] = B[b++];
        }
    }
    return output;
}


int *vector_maximum(const int A[], const int B[], int array_length, int output[]) {
    for (int i = 0; i < array_length; i++) {
        output[i] = A[i] > B[i] ? A[i] : B[i];
    }
    return output;
}


int *merge_sort(int A[], int array_length) {
    if (array_length > 1) {
        int left_array_length = array_length / 2;
        int right_array_length = array_length - left_array_length;
        int *sorted_left = merge_sort(A, left_array_length);
        int *sorted_right = merge_sort(A + left_array_length, right_array_length);
        int *sorted_array = calloc((size_t)array_length, sizeof(int));
        sorted_array = merge(sorted_left, left_array_length, sorted_right, right_array_length, sorted_array);
        for (int i = 0; i < array_length; i++) {
            A[i] = sorted_array[i];
        }
    }
    return A;
}


int main() {
/*
    int A[] = {1, 3, 5, 7, 9};
    unsigned int a_length = 5;
    int B[] = {2, 4, 8, 9, 15, 20};
    unsigned int b_length = 6;
    unsigned int c_length = a_length + b_length;
    int *C = calloc(c_length, sizeof(int));
    C = merge(A, a_length, B, b_length, C);
*/
/*
    int A[] = {1, 3, 5, 7, 9};
    int B[] = {2, 4, 4, 7, 8};
    unsigned int array_length = 5;
    int *C = calloc(array_length, sizeof(int));
    C = vector_maximum(A, B, array_length, C);
    int a_length = array_length;
    int b_length = array_length;
    int c_length = array_length;
*/
    int A[] = {8, 2, 0, 1, 19, 12};
    int a_length = 6;
    int c_length = 6;
    int *C = calloc((size_t)c_length, sizeof(int));
    for (int i = 0; i < c_length; i++) {
        C[i] = A[i];
    }
    C = merge_sort(C, c_length);

    printf("A = [");
    for (int a = 0; a < a_length; a++) {
        printf("%d", A[a]);
        if (a != a_length - 1) {
            printf(",");
        } else {
            printf("]\n");
        }
    }
/*
    printf("B = [");
    for (int b = 0; b < b_length; b++) {
        printf("%d", B[b]);
        if (b != b_length - 1) {
            printf(",");
        } else {
            printf("]\n");
        }
    }
*/
    printf("C = [");
    for (int c = 0; c < c_length; c++) {
        printf("%d", C[c]);
        if (c != c_length - 1) {
            printf(",");
        } else {
            printf("]\n");
        }
    }
    return 0;
}

#pragma clang diagnostic pop
