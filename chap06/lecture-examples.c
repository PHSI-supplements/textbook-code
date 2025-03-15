/*
 * chap06/lecture-examples.c (c) 2021 Christopher A. Bohn
 */

#include <stdio.h>

void traverse_array(int *values, int number_of_values) {
    for (int i = 0; i < number_of_values; i++)
        values[i]++;
}

void traverse_array_with_pointers(int *values, int number_of_values) {
    int *end = values + number_of_values;
    do {
        (*values)++;
        values++;
    } while (values != end);
}

#define R 4
#define C 5

int nested_array_example() {
    int A[R][C] = {{1,  2,  3,  4,  5},
                   {6,  7,  8,  9,  10},
                   {11, 12, 13, 14, 15},
                   {16, 17, 18, 19, 20}
    };
    printf("%p\n", A);
    for (long i = 0; i < R; i++)
        for (long j = 0; j < C; j++)
            printf("%d ", A[i][j]);
    printf("\n");
}

#include <stdio.h>
#include <stdlib.h>
#include <string.h>

struct T {
    long payload;
    char description[16];
    char *other_description;
    struct T *next;
};

char xyzzy(long i, long j) {
    struct T r;
    struct T *s = malloc(sizeof(struct T));
    printf("R at %p\n", &r);
    printf("S at %p\n", s);
    strcpy(s->description, "hello");
    s->other_description = "world";
    printf("%s %s\n", s->description, s->other_description);
    return s->description[i];
}

int main() {
    printf("%c\n", xyzzy(1, 2));
}

void range_check(int i) {
    if (i < 10)
        printf("%d is out of range\n", i);
    else
        printf("%d is in range\n", i);
}

void minimum(int i, int *p) {
    if (p && (i < *p))
        *p = i;
}

int is_sometimes_vowel(char c) {
    if (c == 'w' || c == 'y')
        return 1;
    else
        return 0;
}

void triple(long *value) { *value *= 3; }

void create_eighteen() {
    long value = 6;
    triple(&value);
}

long average_four(long a, long b,
                  long c, long d) {
    return (a + b + c + d) / 4;
}

void print_average() {
    long avg = average_four(15, 20,
                            25, 30);
    printf("%ld\n", avg);
}

unsigned fibonacci(unsigned seed) {
    if (seed < 2)
        return seed;
    else
        return fibonacci(seed - 1) +
               fibonacci(seed - 2);
}

int my_add(int addend, int augend);

int add_and_multiply_by_seven(int a, int b) {
    int seven = my_add(3, 4);
    return (a + b) * seven;
}
