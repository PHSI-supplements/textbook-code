#include <stdio.h>
#include <stdlib.h>

void initialize_timer_and_handlers(int seconds);
void count_loop_iterations(int max_iterations);

constexpr int timer_interval = 1;

uint64_t global_variable = 0x0123'4567'89AB'CDEFuL;

int main () {
    char buffer[80];
    printf("How many loop iterations? ");
    fflush(stdout);
    scanf("%79s", buffer);
    buffer[79] = '\0';
    int number_of_iterations = (int) strtol(buffer, nullptr, 10);
    printf("\n");
    initialize_timer_and_handlers(timer_interval);
    count_loop_iterations(number_of_iterations);
    uint64_t stack_variable = 0x1122'3344'5566'7788uL;
    printf("\nEnter an address to read (FYI, a stack variable is at %p, and a global variable is at %p): ",
           &stack_variable, &global_variable);
    scanf("%79s", buffer);
    buffer[79] = '\0';
    uint64_t address = strtol(buffer, nullptr, 16);
    printf("\n");
    uint64_t *pointer = (uint64_t *) address;
    printf("The content of memory at %p is: %#018llx\n", pointer, *pointer);
    printf("Goodbye!\n");
    return 0;
}