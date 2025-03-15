/*
 * fork_demo.c (c) 2018-20 Christopher A. Bohn
 */

#include <stdio.h>
#include <unistd.h>
#include <stdlib.h>
#include <errno.h>
#include <sys/wait.h>
#include <stdbool.h>
#include <memory.h>

#pragma clang diagnostic push
#pragma clang diagnostic ignored "-Wunknown-pragmas"
#pragma ide diagnostic ignored "OCUnusedGlobalDeclarationInspection"

/*
void two_processes() {
    long j = 0;
    if(fork()) {        // the parent process
        printf("A");fflush(stdout);
        printf("B");fflush(stdout);
        printf("C");fflush(stdout);
        printf("D");fflush(stdout);
        wait(NULL);
        printf("\n");
        printf("%ld\n", j);
    } else {            // the child process
        printf("E");fflush(stdout);
        printf("F");fflush(stdout);
        printf("G");fflush(stdout);
        printf("H");fflush(stdout);
    }
}
*/

void fork_demo() {
    pid_t pid;
    printf("Before fork. \tme =%8d\tchild =     n/a\tparent = %8d\n", getpid(), getppid());
    pid = fork();
    printf("After fork.  \tme =%8d\tchild =%8d\tparent = %8d\n", getpid(), pid, getppid());
    pid = fork();
    printf("Another fork.\tme =%8d\tchild =%8d\tparent = %8d\n", getpid(), pid, getppid());
}


void reap_children();
void sleep_and_exit(int exit_value);

void wait_demo() {
    if (fork()) {   // the parent process
        if (fork()) {
            reap_children();
        } else {
            sleep_and_exit(1);
        }
    } else {        // the child process
        sleep_and_exit(0);
    }
}

void reap_children() {
    pid_t pid;
    int status;
    while ((pid = wait(&status)) > 0) {
        if (WIFEXITED(status)) {
            printf("Process %d terminated with exit status %d.\n", pid, WEXITSTATUS(status));
        } else {
            printf("Process %d terminated abnormally.\n", pid);
        }
    }
    if (errno == ECHILD) {
        printf("No more children.\n");
    } else {
        printf("Unexpected error returned by wait().\n");
    }
}

void waitpid_demo() {
    bool is_parent = true;
    int number_of_children = 4;
    int status;
    pid_t pid, pids[number_of_children];
    for (int i = 0; i < number_of_children; i++) {
        pid = fork();
        if (pid == 0) {
            is_parent = false;
        } else {
            pids[i] = pid;
        }
    }
    if (!is_parent) {
        sleep_and_exit(0);
    } else {
        long counter = 1;
        while ((pid = waitpid(pids[0], &status, WNOHANG)) == 0) {
            counter++;
        }
        printf("Process %d terminated after %ld calls to waitpid().\n", pid, counter);
        pid = waitpid(pids[1], &status, 0);
        printf("Process %d terminated.\n", pid);
        counter = 1;
        while ((pid = waitpid(-1, &status, WNOHANG)) == 0) {
            counter++;
        }
        printf("Process %d terminated after %ld calls to waitpid().\n", pid, counter);
        pid = waitpid(-1, &status, 0);
        printf("Process %d terminated.\n", pid);
    }
}

void sleep_and_exit(int exit_value) {
    sleep(1);
    exit(exit_value);
}

void fork_and_pipe(int *process, int *writing_fd, int *reading_fd0, int *reading_fd1, int *reading_fd2, int pipe_fd[4][2]);

void pipe_demo() {
    int pipe_fd[4][2];
    int process;
    int writing_fd, reading_fd0, reading_fd1, reading_fd2;
    const int size_of_buffer = 256;
    char buffer[size_of_buffer];
    int integer_buffer[1];
    fork_and_pipe(&process, &writing_fd, &reading_fd0, &reading_fd1, &reading_fd2, pipe_fd);
    switch (process) {
        case 0:
            printf("Process 0 is going to sleep...\n");
            sleep(1);
            printf("Process 0 sending a message to process 1...\n");
            write(writing_fd, "go!", 4);
            printf("Process 0 is waiting for process 1...\n");
            read(reading_fd0, buffer, size_of_buffer);
            printf("Process 0 received a message from process1: %s\n", buffer);
            break;
        case 1:
            printf("Process 1 is waiting for process 0...\n");
            read(reading_fd0, NULL, size_of_buffer);    // we don't care what was written
            printf("Process 1 received a message from process 0.\n");
            read(reading_fd1, integer_buffer, sizeof(int));
            int value1 = integer_buffer[0];
            printf("Process 1 received %d from process 2.\n", value1);
            read(reading_fd2, integer_buffer, sizeof(int));
            int value2 = integer_buffer[0];
            printf("Process 1 received %d from process 3.\n", value2);
            sprintf(buffer, "%d + %d = %d", value1, value2, value1 + value2);
            printf("Process 1 sending a message to process 0...\n");
            write(writing_fd, buffer, strlen(buffer) + 1);
            break;
        case 2:
            integer_buffer[0] = 42;
            write(writing_fd, integer_buffer, sizeof(int));
            break;
        case 3:
            integer_buffer[0] = 73;
            write(writing_fd, integer_buffer, sizeof(int));
            break;
        default:
            printf("Process %d reached unreachable code; claims to be the %dth process.\n", getpid(), process);
            exit(-1);
    }
    // files should close when the process terminates, but we'll practice good hygiene anyway
    for (int i = 0; i < 4; i++)
        for (int j = 0; j < 2; j++)
            close(pipe_fd[i][j]);
}

void fork_and_pipe(int *process, int *writing_fd, int *reading_fd0, int *reading_fd1, int *reading_fd2, int pipe_fd[4][2]) {
    for (int i = 0; i < 4; i++) {
        pipe(pipe_fd[i]);
    }
    *process = 0;
    if (fork() == 0) {
        *process += 1;
    }
    if (fork() == 0) {
        *process += 2;
    }
    switch (*process) {
        case 0:
            *reading_fd0 = pipe_fd[1][0];
            break;
        case 1:
            *reading_fd0 = pipe_fd[0][0];
            *reading_fd1 = pipe_fd[2][0];
            *reading_fd2 = pipe_fd[3][0];
            break;
        case 2:
        case 3:
            // these processes won't read in this example
            break;
        default:
            printf("Process %d reached unreachable code; claims to be the %dth process.\n", getpid(), *process);
            exit(-1);
    }
    *writing_fd = pipe_fd[*process][1];
}

int main() {
//    fork_demo();
//    two_processes();
//    wait_demo();
//    waitpid_demo();
    pipe_demo();
    return 0;
}

#pragma clang diagnostic pop
