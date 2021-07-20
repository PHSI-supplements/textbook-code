/*
 * atomic_interleaving.c (c) 2018-21 Christopher A. Bohn
 */

#include <stdio.h>
#include <stdatomic.h>
#include <pthread.h>

const int number_of_pairs = 2;
const int number_of_iterations = 1000000;
pthread_mutex_t mutex;
int nonatomic_shared_variable;
int mutex_shared_variable;
atomic_int atomic_shared_variable;

void *incrementer(void *ignored);
void *decrementer(void *ignored);
void *incrementer_with_mutex(void *ignored);
void *decrementer_with_mutex(void *ignored);

void sequential_code() {
    for (int i = 0; i < number_of_pairs; i++) {
        incrementer(NULL);
        decrementer(NULL);
    }
    printf("After %d sequential iterations, the non-atomic shared variable's value is %d,\n"
           "                                     and the atomic shared variable's value is %d.\n",
           number_of_iterations, nonatomic_shared_variable, atomic_shared_variable);
}

void threaded_code() {
    pthread_t tid[2 * number_of_pairs];
    for (int i = 0; i < number_of_pairs; i++) {
        pthread_create(&tid[2 * i], NULL, incrementer, NULL);
        pthread_create(&tid[2 * i + 1], NULL, decrementer, NULL);
    }
    for (int i = 0; i < 2 * number_of_pairs; i++)
        pthread_join(tid[i], NULL);
    printf("After %d concurrent iterations, the non-atomic shared variable's value is %d,\n"
           "                                     and the atomic shared variable's value is %d.\n",
           number_of_iterations, nonatomic_shared_variable, atomic_shared_variable);
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
    printf("After %d concurrent iterations, the non-atomic shared variable's value is %d,\n"
           "                                    and the mutex'd shared variable's value is %d.\n",
           number_of_iterations, nonatomic_shared_variable, mutex_shared_variable);
}

void *incrementer(void *ignored) {
    for (int i = 0; i < number_of_iterations; i++) {
        nonatomic_shared_variable++;
        atomic_fetch_add_explicit(&atomic_shared_variable, 1, memory_order_relaxed);    // we'll allow accesses to be reordered
    }
    return NULL;
}

void *decrementer(void *ignored) {
    for (int i = 0; i < number_of_iterations; i++) {
        nonatomic_shared_variable--;
        atomic_fetch_sub_explicit(&atomic_shared_variable, 1, memory_order_relaxed);
    }
    return NULL;
}

void *incrementer_with_mutex(void *ignored) {
    for (int i = 0; i < number_of_iterations; i++) {
        nonatomic_shared_variable++;
        pthread_mutex_lock(&mutex);
        mutex_shared_variable++;
        pthread_mutex_unlock(&mutex);
    }
    return NULL;
}

void *decrementer_with_mutex(void *ignored) {
    for (int i = 0; i < number_of_iterations; i++) {
        nonatomic_shared_variable--;
        pthread_mutex_lock(&mutex);
        mutex_shared_variable--;
        pthread_mutex_unlock(&mutex);
    }
    return NULL;
}



int main() {
    nonatomic_shared_variable = 0;
    atomic_init(&atomic_shared_variable, 0);
    clock_t start = clock();
    sequential_code();
    clock_t stop = clock();
    printf("Completed in %f seconds\n", (double)(stop-start)/CLOCKS_PER_SEC);
    nonatomic_shared_variable = 0;
    mutex_shared_variable = 0;
    start = clock();
    mutex_threaded_code();
    stop = clock();
    printf("Completed in %f seconds\n", (double)(stop-start)/CLOCKS_PER_SEC);
    nonatomic_shared_variable = 0;
    atomic_init(&atomic_shared_variable, 0);
    start = clock();
    threaded_code();
    stop = clock();
    printf("Completed in %f seconds\n", (double)(stop-start)/CLOCKS_PER_SEC);
    return 0;
}

