/*
 * nonterminating_loop.c (c) 2018-20 Christopher A. Bohn
 */

#include <stdio.h>
#include <unistd.h>

#define MS_PER_uS 1000

int main() {
    float x;
    int duration = 100 * MS_PER_uS;
    for (x = 0.0; x != 10.0; x += 0.1) {
        printf("x = %f\n", x);
        usleep(duration);
    }
}
