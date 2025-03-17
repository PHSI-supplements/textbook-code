#include <stdio.h>
#include "print-arrays.h"

void print_arrays(int A[], int a_length, int B[], int b_length, int C[], int c_length) {
    if (A) {
        printf("input 1: [");
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
        printf("input 2: [");
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
        printf("output : [");
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