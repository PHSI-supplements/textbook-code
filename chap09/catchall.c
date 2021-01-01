#pragma clang diagnostic push
#pragma clang diagnostic ignored "-Wunknown-pragmas"
#pragma ide diagnostic ignored "EndlessLoop"
#pragma ide diagnostic ignored "UnusedLocalVariable"
/*
 * catchall.c (c) 2018-20 Christopher A. Bohn
 */

#include <stdio.h>
#include <signal.h>

void count_loop_iterations( int max_iterations ) ;
void catch_all(int signal);

int main() {
    sigset(SIGINT, catch_all);
    sigset(SIGVTALRM, catch_all);
    count_loop_iterations(2000);
}

void count_loop_iterations( int max_iterations ) {
    int i = 0;
    int j;
    while (1) {
        printf("Loop iteration %d.\n", i);
        fflush(stdout);
        for (j = 0; j < 100000000; j++);
        i++;
    }
}

void catch_all( int signal ) {
    printf("    ****    Interrupted by Signal %d    ****\n", signal);
}
#pragma clang diagnostic pop