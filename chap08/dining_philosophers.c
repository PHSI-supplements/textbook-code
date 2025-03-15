/*
 * dining_philosophers.c (c) 2018-20 Christopher A. Bohn
 */

#include <stdio.h>
#include <pthread.h>
#include <stdbool.h>
#include <unistd.h>
#include <stdlib.h>

#pragma clang diagnostic push
#pragma clang diagnostic ignored "-Wunknown-pragmas"
#pragma ide diagnostic ignored "cert-msc50-cpp"
#pragma ide diagnostic ignored "UnusedLocalVariable"
#pragma ide diagnostic ignored "UnreachableCode"
#pragma ide diagnostic ignored "ConstantConditionsOC"
#pragma ide diagnostic ignored "UnusedValue"
#pragma clang diagnostic ignored "-Wunused-variable"
#pragma ide diagnostic ignored "OCUnusedGlobalDeclarationInspection"
const int number_of_philosophers = 3;
const char *names[] = {"Stu Dent   ", "Dee Veloper", "Connie Seur"};
const int runtime = 2;          // seconds
const int min_delay = 1000;
const int max_delay = 1000000;  // microseconds

enum philosopher_state {
    THINKING, HUNGRY, EATING
};

pthread_mutex_t chopsticks[number_of_philosophers];
bool running = true;

void *basic_philosopher(void *args);
void *initially_hungry_philosopher(void *args);
void *polite_philosopher(void *args);
void *starving_philosopher(void *args);
void delay();

void start_dining() {
    pthread_t tid[number_of_philosophers];
    int seats[number_of_philosophers];
    for (int i = 0; i < number_of_philosophers; i++)
        pthread_mutex_init(chopsticks + i, NULL);
    for (int i = 0; i < number_of_philosophers; i++) {
        seats[i] = i;
//        pthread_create(tid + i, NULL, basic_philosopher, seats + i);
//        pthread_create(tid + i, NULL, initially_hungry_philosopher, seats + i);
//        pthread_create(tid + i, NULL, polite_philosopher, seats + i);
        pthread_create(tid + i, NULL, starving_philosopher, seats + i);
    }
    sleep(runtime);
    printf("*** TERMINATING ***\n");
    running = false;
    for (int i = 0; i < number_of_philosophers; i++)
        pthread_join(tid[i], NULL);
}

void *basic_philosopher(void *args) {
    int seat = ((int *)args)[0];
    const char *name = names[seat];
    int left = seat;
    int right = (seat + 1) % number_of_philosophers;
    enum philosopher_state state = THINKING;
    printf("%s sits at the table in seat %d with access to chopsticks %d and %d.\n", name, seat, left, right);
    while (running) {
        state = THINKING;
        printf("%s is THINKING.\n", name);
        delay();
        if (!running) continue;
        state = HUNGRY;
        printf("%s is HUNGRY.\n", name);
        printf("%s needs the left  chopstick (%d).\n", name, left);
        pthread_mutex_lock(chopsticks + left);
        printf("%s has   the left  chopstick (%d).\n", name, left);
        printf("%s needs the right chopstick (%d).\n", name, right);
        pthread_mutex_lock(chopsticks + right);
        printf("%s has   the right chopstick (%d).\n", name, right);
        state = EATING;
        printf("%s is EATING.\n", name);
        delay();
        pthread_mutex_unlock(chopsticks + left);
        printf("%s drops the left  chopstick (%d).\n", name, left);
        pthread_mutex_unlock(chopsticks + right);
        printf("%s drops the right chopstick (%d).\n", name, right);
    }
    printf("%s leaves the table.\n", name);
    return NULL;
}

void *initially_hungry_philosopher(void *args) {
    int seat = ((int *)args)[0];
    const char *name = names[seat];
    int left = seat;
    int right = (seat + 1) % number_of_philosophers;
    enum philosopher_state state = THINKING;
    printf("%s sits at the table in seat %d with access to chopsticks %d and %d.\n", name, seat, left, right);
    while (running) {
        state = HUNGRY;
        printf("%s is HUNGRY.\n", name);
        printf("%s needs the left  chopstick (%d).\n", name, left);
        pthread_mutex_lock(chopsticks + left);
        printf("%s has   the left  chopstick (%d).\n", name, left);
        printf("%s needs the right chopstick (%d).\n", name, right);
        pthread_mutex_lock(chopsticks + right);
        printf("%s has   the right chopstick (%d).\n", name, right);
        state = EATING;
        printf("%s is EATING.\n", name);
        delay();
        pthread_mutex_unlock(chopsticks + left);
        printf("%s drops the left  chopstick (%d).\n", name, left);
        pthread_mutex_unlock(chopsticks + right);
        printf("%s drops the right chopstick (%d).\n", name, right);
        state = THINKING;
        printf("%s is THINKING.\n", name);
        delay();
    }
    printf("%s leaves the table.\n", name);
    return NULL;
}

void *polite_philosopher(void *args) {
    int seat = ((int *)args)[0];
    const char *name = names[seat];
    int left = seat;
    int right = (seat + 1) % number_of_philosophers;
    enum philosopher_state state = THINKING;
    printf("%s sits at the table in seat %d with access to chopsticks %d and %d.\n", name, seat, left, right);
    bool has_left = false, has_right = false;
    while (running) {
        state = HUNGRY;
        printf("%s is HUNGRY.\n", name);
        while (!(has_left && has_right)) {
            if (!has_left) {
                printf("%s needs the left  chopstick (%d).\n", name, left);
                if (!pthread_mutex_trylock(chopsticks + left)) {
                    has_left = true;
                    printf("%s has   the left  chopstick (%d).\n", name, left);
                } else if (has_right) {
                    pthread_mutex_unlock(chopsticks + right);
                    printf("%s drops the right chopstick (%d); still HUNGRY.\n", name, right);
                    has_right = false;
                    usleep(min_delay);
                }
            }
            if (!has_right) {
                printf("%s needs the right chopstick (%d).\n", name, right);
                if (!pthread_mutex_trylock(chopsticks + right)) {
                    has_right = true;
                    printf("%s has   the right chopstick (%d).\n", name, right);
                } else if (has_left) {
                    pthread_mutex_unlock(chopsticks + left);
                    printf("%s drops the left  chopstick (%d); still HUNGRY.\n", name, left);
                    has_left = false;
                    usleep(min_delay);
                }
            }
        }
        state = EATING;
        printf("%s is EATING.\n", name);
        delay();
        pthread_mutex_unlock(chopsticks + left);
        printf("%s drops the left  chopstick (%d).\n", name, left);
        has_left = false;
        pthread_mutex_unlock(chopsticks + right);
        printf("%s drops the right chopstick (%d).\n", name, right);
        has_right = false;
        state = THINKING;
        printf("%s is THINKING.\n", name);
        delay();
    }
    printf("%s leaves the table.\n", name);
    return NULL;
}

void *starving_philosopher(void *args) {
    int seat = ((int *)args)[0];
    const char *name = names[seat];
    int left = seat;
    int right = (seat + 1) % number_of_philosophers;
    enum philosopher_state state = THINKING;
    printf("%s sits at the table in seat %d with access to chopsticks %d and %d.\n", name, seat, left, right);
    bool has_left = false, has_right = false;
    clock_t start, stop;
    while (running) {
        state = HUNGRY;
        start = clock();
        printf("%s is HUNGRY.\n", name);
        while (!(has_left && has_right)) {
            if (!has_left) {
                printf("%s needs the left  chopstick (%d).\n", name, left);
                if (!pthread_mutex_trylock(chopsticks + left)) {
                    has_left = true;
                    printf("%s has   the left  chopstick (%d).\n", name, left);
                } else if (has_right && (seat != 0)) {
                    pthread_mutex_unlock(chopsticks + right);
                    printf("%s drops the right chopstick (%d); still HUNGRY.\n", name, right);
                    has_right = false;
                    usleep(min_delay);
                }
            }
            if (!has_right) {
                printf("%s needs the right chopstick (%d).\n", name, right);
                if (!pthread_mutex_trylock(chopsticks + right)) {
                    has_right = true;
                    printf("%s has   the right chopstick (%d).\n", name, right);
                } else if (has_left && (seat != 2)) {
                    pthread_mutex_unlock(chopsticks + left);
                    printf("%s drops the left  chopstick (%d); still HUNGRY.\n", name, left);
                    has_left = false;
                    usleep(min_delay);
                }
            }
        }
        state = EATING;
        stop = clock();
        printf("%s is EATING after being HUNGRY for %f seconds.\n", name, (double)(stop - start) / CLOCKS_PER_SEC);
        delay();
        pthread_mutex_unlock(chopsticks + left);
        printf("%s drops the left  chopstick (%d).\n", name, left);
        has_left = false;
        pthread_mutex_unlock(chopsticks + right);
        printf("%s drops the right chopstick (%d).\n", name, right);
        has_right = false;
        state = THINKING;
        printf("%s is THINKING.\n", name);
        delay();
    }
    printf("%s leaves the table.\n", name);
    return NULL;
}

void delay() {
    useconds_t duration = (useconds_t)(rand() % (max_delay - min_delay + 1)) + min_delay;
    usleep(duration);
}

int main() {
    start_dining();
    return 0;
}

#pragma clang diagnostic pop
