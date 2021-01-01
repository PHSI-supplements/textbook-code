/*
 * signal_handler_demo.c (c) 2018-20 Christopher A. Bohn
 */

#include <stdio.h>
#include <signal.h>
#include <sys/time.h>

struct itimerval timer;

void count_loop_iterations(int max_iterations);
void set_timer(int seconds);
void alarm_handler(int signal);
void memory_access_handler(int signal);


int main() {
    set_timer(1);
    sigset(SIGVTALRM, alarm_handler);
    count_loop_iterations(20);
    sigset(SIGSEGV, memory_access_handler);
    int *pointer;
    pointer = 0;
    printf("%d", *pointer);
    return 0;
}

void count_loop_iterations(int max_iterations) {
    int i = 0;
    int j;
    while (i < max_iterations) {
        printf("Loop iteration %d.\n", i);
        fflush(stdout);
        for (j = 0; j < 100000000; j++);
        i++;
    }
}

void set_timer(int seconds) {
    timer.it_value.tv_sec = seconds;
    timer.it_value.tv_usec = 0;
    timer.it_interval.tv_sec = seconds;
    timer.it_interval.tv_usec = 0;
    setitimer(ITIMER_VIRTUAL, &timer, NULL);
}

void alarm_handler(int signal) {
    printf("    ****    Interrupted by Signal %d (SIGVTALRM)    ****\n", signal);
}
