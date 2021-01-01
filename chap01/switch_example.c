/*
 * switch_example.c (c) 2018-20 Christopher A. Bohn
 */

#include <stdio.h>
#include <stdlib.h>

void using_switch(int value) {
    switch (value) {
        case 1:
            printf("One\n");
            break;
        case 2:
            printf("Two\n");
            // fall through
        case 3:
            printf("Or maybe three\n");
            break;
        case 4:
        case 5:
            printf("Four ");
            printf("or five\n");
            break;
        default:
            printf("Greater than five or less than one\n");
    }
}

void using_if(int value) {
    if (value == 1) {
        printf("One\n");
    }
    if (value == 2) {
        printf("Two\n");
    }
    if (value == 2 || value == 3) {
        printf("Or maybe three\n");
    }
    if (value == 4 || value == 5) {
        printf("Four ");
        printf("or five\n");
    }
    if (value < 1 || value > 5) {
        printf("Greater than five or less than one\n");
    }
}

int main(int argc, const char **argv) {
    int value = (int)strtol(argv[1], NULL, 0);
    printf("%d is ", value);
    using_if(value);
    printf("\n");
    printf("%d is ", value);
    using_switch(value);
    printf("\n");
}
