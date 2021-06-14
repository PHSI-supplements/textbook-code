/*
 * signal_handler_demo.c (c) 2018-20 Christopher A. Bohn
 */

// Need to expose Single UNIX Specification definitions, including sigset
#define _XOPEN_SOURCE 700
#include <stdio.h>
#include <stdlib.h>
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
    sigset(SIGINT, alarm_handler);
    sigset(SIGSEGV, memory_access_handler);
    count_loop_iterations(200);
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
    if (signal == 26)
        printf("    ****    Interrupted by Signal %d (SIGVTALRM)    ****\n", signal);
    else if (signal == 2)
        printf("    ****    Interrupted by Signal %d (SIGINT)    ****\n", signal);
    else
        printf("    ****    Interrupted by Signal %d (OTHER)    ****\n", signal);
}

void memory_access_handler( int signal ) {
    printf("You tried to access memory you shouldn’t. Naughty, naughty!\n");
    exit(1);
} 
