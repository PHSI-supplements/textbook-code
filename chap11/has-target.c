/*
 * has-target.c (c) 2018-20 Christopher A. Bohn
 */

#include <stdio.h>
#include <stdlib.h>

void buffer_too_small();

void caller();

int main() {
    caller();
}

void caller() {
    buffer_too_small();
    printf("Returned to caller. Booooring.\n");
}

void not_caller() {
    printf("Did not return to caller! (insert maniacal laugh here)\n");
    exit(0);
}

void buffer_too_small() {
    puts("Enter a string:");
    char buffer[8]; // too small
    printf("Buffer at %p\n", buffer);
    gets(buffer);
    puts(buffer);
}
