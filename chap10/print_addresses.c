#pragma clang diagnostic push
#pragma clang diagnostic ignored "-Wunknown-pragmas"
#pragma ide diagnostic ignored "UnusedValue"
#pragma ide diagnostic ignored "UnusedLocalVariable"
#pragma clang diagnostic ignored "-Wreturn-stack-address"
#pragma ide diagnostic ignored "OCUnusedGlobalDeclarationInspection"
/*
 * print_addresses.c (c) 2018-20 Christopher A. Bohn
 */

#include <stdio.h>

long *print_stack_address() {
    long l = 1L;
    printf("In subroutine:\n");
    printf("Value: %ld\n", l);
    printf("Address: %p\n\n", &l);
    return &l;      // this is a bad idea
}

void use_address_from_locally_scoped_variable(long *l) {
    printf("Value: %ld\n", *l);
    printf("Address: %p\n", l);
    printf("\tBSD (MacOS) using clang: Address has different value.\n");
    printf("\tLinux using clang: Address has same value.\n");
    printf("\tLinux using gcc: Segmentation fault.\n");
}

int main() {
    long l = 1L;
    printf("In main:\n");
    printf("Address: %p\n\n", &l);
    long *ll = print_stack_address();
//    use_address_from_locally_scoped_variable(ll);
    return 0;
}

#pragma clang diagnostic pop