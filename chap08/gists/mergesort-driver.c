#include <string.h>
#include "print-arrays.h"

int *merge_sort(int A[], int array_length);

constexpr int ARRAY_SIZE = 128;

int C[ARRAY_SIZE] = {
         37,  91,  12,  76,  85,  47,  58, 126,  31,  94,  17,  79, 108,  62,  44,  99,
         24,  15,  71,  66,  83, 113,  52, 102,  46, 128,  18,  53,  38,  81,  97,  75,
        122,  16,  42,  93, 106,  35,  50,  67, 116,  26,  88,  23,  78,  39,  14,  60,
         28,  87, 103,  22,  55,  92,  11,  77,  40,  90,  49, 109,  13,  56,  32,  82,
         21,  64,  86,  19, 120,  63,  34,  27,  80, 124,  20, 127,  30,  25, 118, 100,
         98,  48, 123,  59,  95, 105,  57,  33,  68,  74,  70,  45,  43,  72,  41, 125,
         61,  54,  89, 110,  65, 115,  29,  96,  36, 104,   9,  51,  10,   2,  84,   1,
        112,  69,  73,   3,  87, 114,   4,  86,   6,  85,  58,  20,  97,  22,  79,  31
};

int main() {
    int array[ARRAY_SIZE];
    memcpy(array, C, ARRAY_SIZE * sizeof(int));
    merge_sort(array, ARRAY_SIZE);
    print_arrays(C, ARRAY_SIZE,
                 nullptr, 0,
                 array, ARRAY_SIZE);
}