#pragma clang diagnostic push
#pragma clang diagnostic ignored "-Wunknown-pragmas"
#pragma ide diagnostic ignored "UnusedLocalVariable"
/*
 * segfaultmaker.c (c) 2018-20 Christopher A. Bohn
 */

#include <stdio.h>
#include <stdlib.h>
#include <signal.h>

void memory_access_handler(int signal);

int main() {
    sigset(SIGSEGV, memory_access_handler);
    int *pointer;
    pointer = 0;
    printf("%d", *pointer);
    return 0;
}

void memory_access_handler(int signal) {
    printf("You tried to access memory you shouldn't. Naughty, naughty!\n");
    exit(1);
}
#pragma clang diagnostic pop