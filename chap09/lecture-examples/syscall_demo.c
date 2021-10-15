#include <stdio.h>
#include <unistd.h>

int main(int argc, char *argv[]) {
    write(1, "Before fork.\n", 13);
    int pid = 0;
    fork();
    pid = getpid();
    printf("PID = %d\n", pid);
}
