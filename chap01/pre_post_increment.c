/*
 * pre_post_increment.c (c) 2018-20 Christopher A. Bohn
 */

#include <stdio.h>

void post_increment() {
    int primes[] = {2, 3, 5, 7, 11, 13};
    int i = 0;
    int p = primes[i++];
    printf("p==%d i==%d\n", p, i);
}

void pre_increment() {
    int primes[] = {2, 3, 5, 7, 11, 13};
    int i = 0;
    int p = primes[++i];
    printf("p==%d i==%d\n", p, i);
}

int main() {
    printf("Post-increment example:\n\t");
    post_increment();
    printf("Pre-increment example:\n\t");
    pre_increment();
    return 0;
}
