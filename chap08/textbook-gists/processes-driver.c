#include <stdio.h>
#include <unistd.h>
#include "menu.h"

void fork_demo(void);
void pipe_demo(void);
void wait_demo(void);
void waitpid_demo(void);

menu_option_t const functions[] = {
        {.option = fork_demo, .description = "fork() demonstration"},
        {.option = wait_demo, .description = "wait() demonstration"},
        {.option = waitpid_demo, .description = "waitpid() demonstration"},
        {.option = pipe_demo, .description = "pipe() demonstration"},
};

int main() {
    pid_t pid = getpid();
    void (*function)(void);
    do {
        function = select_option(functions, sizeof(functions) / sizeof(menu_option_t));
        if (function) {
            function();
        }
    } while(function && pid == getpid());
    printf("%d says: Goodbye!\n", getpid());
}