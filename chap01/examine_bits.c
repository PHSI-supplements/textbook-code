/*
 * examine_bits.c (c) 2018-24 Christopher A. Bohn
 */

#include <stdio.h>
#include <stdint.h>

void examine_bits_short(short x) {
    if (x & 0x1)
        printf("%d is odd.\n", x);
    else
        printf("%d is even.\n", x);
    if (!x)
        printf("%d is zero.\n", x);
//    else if (x & 0x8000)                          // this is clearer but machine-specific
    else if (x & (1 << (8 * sizeof(short) - 1)))    // this is not machine-specific
        printf("%d is negative.\n", x);
    else
        printf("%d is positive.\n", x);
}

void examine_bits_defined_length(int16_t x) {
    if (x & 0x1)
        printf("%d is odd.\n", x);
    else
        printf("%d is even.\n", x);
    if (!x)
        printf("%d is zero.\n", x);
    else if (x & 0x8000)
        printf("%d is negative.\n", x);
    else
        printf("%d is positive.\n", x);
}

int main() {
    examine_bits_defined_length(3);
    examine_bits_defined_length(0);
    examine_bits_defined_length(-3);
    examine_bits_defined_length(4);
    examine_bits_defined_length(-8);
}
