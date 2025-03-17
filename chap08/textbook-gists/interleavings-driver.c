#include <stdio.h>
#include <stdlib.h>
#include "menu.h"

void sequential_code(int number_of_pairs, int number_of_iterations);
void unsynchronized_code(int number_of_pairs, int number_of_iterations);
void mutex_threaded_code(int number_of_pairs, int number_of_iterations);
void atomic_code(int number_of_pairs, int number_of_iterations);

menu_option_t const functions[] = {
        {.option = sequential_code,     "Using a shared variable without threading"},
        {.option = unsynchronized_code, "Using a shared variable among threads, without synchronizing accesses"},
        {.option = mutex_threaded_code, "Using a shared variable among threads, using a mutex to synchronize accesses"},
        {.option = atomic_code,         "Using a shared variable among threads, using C11 atomics to synchronize accesses (possibly using hardware support)"},
};

int main() {
    int number_of_pairs, number_of_iterations;
    char buffer[80];
    printf("How many pairs? ");
    scanf("%79s", buffer);
    buffer[79] = '\0';
    number_of_pairs = (int) strtol(buffer, nullptr, 10);
    printf("\nHow many iterations? ");
    scanf("%79s", buffer);
    buffer[79] = '\0';
    number_of_iterations = (int) strtol(buffer, nullptr, 10);
    printf("\n");
    void (*function)(int, int);
    do {
        function = select_option(functions, sizeof(functions) / sizeof(menu_option_t));
        if (function) {
            function(number_of_pairs, number_of_iterations);
        }
    } while (function);
    printf("Goodbye!\n");
}