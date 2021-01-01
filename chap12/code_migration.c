#pragma clang diagnostic push
#pragma clang diagnostic ignored "-Wunknown-pragmas"
#pragma ide diagnostic ignored "OCUnusedGlobalDeclarationInspection"
/*
 * code_migration.c (c) 2018-20 Christopher A. Bohn
 */

#include <string.h>

/*
void average_neighbors1(const double *matrix, int width, int height) {
    // doesn't actually work in C, because the dimensions are unknown
    double above, below, left, right;
    for (int i = 0; i < width; i++)
        for (int j = 0; j < height; j++) {
            above = matrix[i-1][j];
            below = matrix[i+1][j];
             left = matrix[i][j-1];
            right = matrix[i][j+1];
            double neighbor_average = (above + below + left + right) / 4;
            matrix[i][j] = (matrix[i][j] + neighbor_average) / 2;
        }
}
*/

void average_neighbors(double *matrix, int width, int height) {
    double above, below, left, right;
    for (int i = 0; i < width; i++)
        for (int j = 0; j < height; j++) {
            above = matrix[(i - 1) * width +  j];
            below = matrix[(i + 1) * width +  j];
             left = matrix[i       * width + (j - 1)];
            right = matrix[i       * width + (j + 1)];
            double neighbor_average = (above + below + left + right) / 4;
            matrix[i * width + j] = (matrix[i * width + j] + neighbor_average) / 2;
        }
}

void average_neighbors_after_extracting_common_subexpression(double *matrix, int width, int height) {
    double above, below, left, right;
    for (int i = 0; i < width; i++)
        for (int j = 0; j < height; j++) {
            int current_element = i * width + j;
            above = matrix[current_element - width];
            below = matrix[current_element + width];
             left = matrix[current_element - 1];
            right = matrix[current_element + 1];
            double neighbor_average = (above + below + left + right) / 4;
            matrix[current_element] = (matrix[current_element] + neighbor_average) / 2;
        }
}

void foo(int *destination, const int *source, int factor, int limit) {
    for (int i = 0; i < limit; i++) {
        destination[factor * limit + i] = source[i];
    }
}

void foo_after_code_migration(int *destination, const int *source, int factor, int limit) {
    int step = factor * limit;
    for (int i = 0; i < limit; i++) {
        destination[step + i] = source[i];
    }
}

void custom_string_copy(char *destination, char *source) {
    for (int i = 0; i < strlen(source); i++) {
        destination[i] = source[i];
    }
}

void custom_string_copy_after_code_migration(char *destination, char *source) {
    unsigned long string_length = strlen(source);
    for (int i = 0; i < string_length; i++) {
        destination[i] = source[i];
    }
}

#pragma clang diagnostic pop