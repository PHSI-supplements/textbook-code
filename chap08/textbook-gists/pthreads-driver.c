#include <stdio.h>
#include "menu.h"

void thread_demo(void);
void shared_memory_demo(void);

menu_option_t const functions[] = {
        {.option = thread_demo,        "pthread_create() and pthread_join() demonstration"},
        {.option = shared_memory_demo, "demonstration of using shared memory across threads"},
};

int main() {
    void (*function)(void);
    do {
        function = select_option(functions, sizeof(functions) / sizeof(menu_option_t));
        if (function) {
            function();
        }
    } while(function);
    printf("Goodbye!\n");
}