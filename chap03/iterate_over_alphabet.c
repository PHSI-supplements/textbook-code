/*
 * iterate_over_alphabet.c (c) 2018-20 Christopher A. Bohn
 */

#include <stdio.h>

int main() {
    printf("Iterating over the lower-case letters...\n");
    for (char c = 'a'; c <= 'z'; c++)
        printf("%c ", c);
    printf("\n");
}
