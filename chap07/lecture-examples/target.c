#include <stdio.h>
#include <stdlib.h>

char global_buffer[512] = {0};

void kick_me() {
    printf("This function exists only to provide ROP instructions.\n");
    __asm__(
            "addq %rsi, %rdi\n"
            "ret\n"
            "movl $20, %edi\n"
            "ret\n"
            "movq %rdi, %rax\n"
            "nop\n"
            "nop\n"
            "ret\n"
//            "movq $53, %rsi\n"
            "movabsq $0x35c6c74800, %rbp\n"
            "nop\n"
            "ret\n"
            );
    printf("There really isn't any other point to it.\n");
}

void print_integer(int number) {
    printf("The number is %d\n", number);
//    exit(0);
}

void get_inputs() {
    char local_buffer[24];
//    printf("Let's put something in the global buffer at address %p: \n", global_buffer);
//    fgets(global_buffer, 512, stdin);
    printf("Now the local buffer at address %p: \n", local_buffer);
    gets(local_buffer);
    print_integer(231);
}

void bar() {
    get_inputs();
    printf("Back in bar.\n");
}

void foo() {
    bar();
    printf("Back in foo.\n");
}

int main() {
    foo();
    printf("Back in main.\n");
    return 0;
}
