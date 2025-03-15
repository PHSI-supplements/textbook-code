/*
 * buffer_too_small.c (c) 2018-20 Christopher A. Bohn
 */

#include <stdio.h>

void buffer_too_small();

void caller();

int main() {
    caller();
}

void caller() { buffer_too_small(); }

void buffer_too_small() {
    puts("Enter a string:");
    char buffer[8]; // too small
    gets(buffer);
    puts(buffer);
}
