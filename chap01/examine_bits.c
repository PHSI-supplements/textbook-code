/*
 * examine_bits.c (c) 2018-20 Christopher A. Bohn
 */

#include <stdio.h>

void examine_bits(short x) {
    if (x & 0x1)
        printf("%d is odd.\n", x);
    else
        printf("%d is even.\n", x);
    if (!x)
        printf("%d is zero.\n", x);
//    else if (x & 0x8000)                          // this is clearer
    else if (x & (1 << (8 * sizeof(short) - 1)))    // this is not machine-specific
        printf("%d is negative.\n", x);
    else
        printf("%d is positive.\n", x);
}

int main() {
    examine_bits(3);
    examine_bits(0);
    examine_bits(-3);
    examine_bits(4);
    examine_bits(-8);
}
