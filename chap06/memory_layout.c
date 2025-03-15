#include <stdio.h>
#include <stdlib.h>

long global_variable = 73;

void print_stack_address(const long *addr) {
    long new_addr = 42;
    if (addr) {
        printf("      First called stack frame at %14p\n", addr);
        printf("     Second called stack frame at %14p\n", &new_addr);
    } else {
        print_stack_address(&new_addr);
    }
}

int main() {
    long main_var = 88;
    const char string[] = "Hello, world!";
    long *first_addr = NULL;
    printf("              Main stack frame at %14p\n", &main_var);
    print_stack_address(first_addr);
    long *small = (long *) malloc(16);
    printf("Small malloc'd variable stored at %14p\n", small);
    long *large = (long *) malloc(1 << 24);
    printf("Large malloc'd variable stored at %14p\n", large);
    printf("        Called function stored at %14p\n", print_stack_address);
    printf("        Global variable stored at %14p\n", &global_variable);
    printf("        String constant stored at %14p\n", string);
    return 0;
}
