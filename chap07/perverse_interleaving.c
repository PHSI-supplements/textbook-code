/*
 * perverse_interleaving.c (c) 2018-20 Christopher A. Bohn
 */

#include <stdio.h>
#include <pthread.h>

#pragma clang diagnostic push
#pragma clang diagnostic ignored "-Wunknown-pragmas"
#pragma ide diagnostic ignored "UnusedLocalVariable"
#pragma clang diagnostic ignored "-Wunknown-pragmas"
#pragma clang diagnostic ignored "-Wunused-parameter"
#pragma ide diagnostic ignored "OCUnusedGlobalDeclarationInspection"
const int number_of_pairs = 2;
const int number_of_iterations = 1000000;
volatile int shared_variable = 0;

void *incrementer(void *ignored);
void *decrementer(void *ignored);

void sequential_code() {
    for (int i = 0; i < number_of_pairs; i++) {
        incrementer(NULL);
        decrementer(NULL);
    }
    printf("After %d iterations, the shared variable's value is %d.\n", number_of_iterations, shared_variable);
}

void *incrementer(void *ignored) {
    for (int i = 0; i < number_of_iterations; i++)
        shared_variable++;
    return NULL;
}

void *decrementer(void *ignored) {
    for (int i = 0; i < number_of_iterations; i++)
        shared_variable--;
    return NULL;
}

void threaded_code() {
    pthread_t tid[2 * number_of_pairs];
    for (int i = 0; i < number_of_pairs; i++) {
        pthread_create(&tid[2 * i], NULL, incrementer, NULL);
        pthread_create(&tid[2 * i + 1], NULL, decrementer, NULL);
    }
    for (int i = 0; i < 2 * number_of_pairs; i++)
        pthread_join(tid[i], NULL);
    printf("After %d iterations, the shared variable's value is %d.\n", number_of_iterations, shared_variable);
}


pthread_mutex_t mutex;

void *incrementer_with_mutex(void *ignored) {
    for (int i = 0; i < number_of_iterations; i++) {
        pthread_mutex_lock(&mutex);
        shared_variable++;
        pthread_mutex_unlock(&mutex);
    }
    return NULL;
}

void *decrementer_with_mutex(void *ignored) {
    for (int i = 0; i < number_of_iterations; i++) {
        pthread_mutex_lock(&mutex);
        shared_variable--;
        pthread_mutex_unlock(&mutex);
    }
    return NULL;
}


void mutex_threaded_code() {
    pthread_t tid[2 * number_of_pairs];
    pthread_mutex_init(&mutex, NULL);
    for (int i = 0; i < number_of_pairs; i++) {
        pthread_create(&tid[2 * i], NULL, incrementer_with_mutex, NULL);
        pthread_create(&tid[2 * i + 1], NULL, decrementer_with_mutex, NULL);
    }
    for (int i = 0; i < 2 * number_of_pairs; i++)
        pthread_join(tid[i], NULL);
    pthread_mutex_destroy(&mutex);
    printf("After %d iterations, the shared variable's value is %d.\n", number_of_iterations, shared_variable);
}


int main() {
    clock_t start = clock();
//    sequential_code();
    threaded_code();
//    mutex_threaded_code();
    clock_t stop = clock();
    printf("Completed in %f seconds", (double)(stop-start)/CLOCKS_PER_SEC);
    return 0;
}


#pragma clang diagnostic pop
