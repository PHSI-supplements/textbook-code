/*
 * rop-victim.c (c) 2018-20 Christopher A. Bohn
 */

#include <stdio.h>

void buffer_too_small();

void caller();

int four(int arg1, int arg2);

int main() {
    caller();
}

void caller() {
    buffer_too_small();
    printf("Returned to caller. Booooring.\n");
}

int two() {
    return 2;
}

int three(int arg1, int arg2) {
    int input = four(arg1, arg2);
    int value = input + 3;
    return value;
}

int four(int arg1, int arg2) {
    printf("%d + %d = %d\n", arg1, arg2, arg1 + arg2);
    return arg1 + arg2;
}

int five() {
    int value = four(1, 1);
    printf("%d\n", value);
    return value;
}

void buffer_too_small() {
    puts("Enter a string:");
    char buffer[8]; // too small
    gets(buffer);
}
