/*
 * thread_demo.c (c) 2018-20 Christopher A. Bohn
 */

#include <stdio.h>
#include <pthread.h>
#include <stdlib.h>


#pragma clang diagnostic push
#pragma clang diagnostic ignored "-Wunknown-pragmas"
#pragma clang diagnostic ignored "-Wincompatible-pointer-types"
#pragma ide diagnostic ignored "UnusedLocalVariable"
#pragma ide diagnostic ignored "OCUnusedGlobalDeclarationInspection"
void *thread_routine(void *args);

void thread_demo() {
    char *an_array_on_stack[12];
    printf("Before creating a thread, a      stack variable is at address %p.\n", an_array_on_stack);
    pthread_t tid;
    pthread_create(&tid, NULL, thread_routine, NULL);
    char *another_array_on_stack[2];
    printf("After a creating thread, another stack variable is at address %p.\n", another_array_on_stack);
    pthread_join(tid, NULL);
}

void *thread_routine(void *args) {
    char *another_array_on_stack[5];
    printf("The thread's                     stack variable is at address %p.\n", another_array_on_stack);
    return NULL;
}

void *adder(void *args);
void *writer(void *args);

void shared_memory_demo() {
    pthread_t tid[3];
    int i, j;
    int m = 1;
    int n = 2;
    // since we're mixing types, pick a suitably-sized type and cast back-and-forth
    uint64_t args[3] = {(uint64_t)&tid, (uint64_t)&i, (uint64_t)&j};
    pthread_create(tid, NULL, adder, args);
    int *argm[2] = {&m, &i};
    pthread_create(tid + 1, NULL, writer, argm);
    int *argn[2] = {&n, &j};
    pthread_create(tid + 2, NULL, writer, argn);
    int *value;
    pthread_join(tid[0], &value);
    printf("Main thread %ld received %d from thread %ld.\n", (long)pthread_self(), *value, (long)tid[0]);
    fflush(stdout);
}

void *adder(void *args) {
    pthread_t *tid;
    int *i, *j;
    tid = (pthread_t *)((uint64_t *)args)[0];
    i = (int *)((uint64_t *)args)[1];
    j = (int *)((uint64_t *)args)[2];
    printf("Thread %ld waiting until we're sure the peer threads wrote their values.\n", (long)pthread_self());
    pthread_join(tid[1], NULL);
    pthread_join(tid[2], NULL);
    int *value = malloc(sizeof(int));   // creating space on the heap
    *value = *i + *j;
    printf("Thread %ld calculated %d + %d = %d.\n", (long)pthread_self(), *i, *j, *value);
    return value;
}

void *writer(void *args) {
    int *worker, *target;
    worker = ((int **)args)[0];
    target = ((int **)args)[1];
    if (*worker == 1) {
        printf("Thread %ld writing 42 to i.\n", (long)pthread_self());
        *target = 42;
    } else if (*worker == 2) {
        printf("Thread %ld writing 73 to j.\n", (long)pthread_self());
        *target = 73;
    } else {
        printf("Thread %ld reached unreachable code with worker==%d.\n", (long)pthread_self(), *worker);
    }
    return NULL;
}

int main() {
//    thread_demo();
    shared_memory_demo();
    return 0;
}

#pragma clang diagnostic pop
