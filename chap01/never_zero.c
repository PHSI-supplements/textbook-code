/*
 * is_zero.c (c) 2018-20 Christopher A. Bohn
 */

#include <stdio.h>

void is_zero(int x);

int main() {
    is_zero(1);
    is_zero(0);
}

void is_zero(int x) {
    printf("x is %d\n", x);
    if (x=0) printf("x is zero\n");
    else printf("x is not zero\n");
}
