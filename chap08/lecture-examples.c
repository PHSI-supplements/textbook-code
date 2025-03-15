/*
 * chap07/lecture-examples.c (c) 2021 Christopher A. Bohn
 */

#include <stdio.h>
#include <unistd.h>

void orphan_demo();

void orphan_demo() {
    if (fork()) {
        printf("Parent process (%d) terminating.\n", getpid());
    } else {
        printf("Child process (%d) running.\n", getpid());
        while(1);
    }
}

int main() {
    orphan_demo();
    return 0;
}
