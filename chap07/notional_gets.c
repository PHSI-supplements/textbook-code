/*
 * notional_gets.c (c) 2021 Christopher A. Bohn
 */


#include <stdio.h>

/* gets: read newline-terminated string from stdin into s.
 * This simple implementation does not handle errors. */
char *my_gets(char *s) {
    int c;
    char *p = s;
    while (((c = getchar()) != EOF) && (c != '\n')) {
        *p++ = c;
    }
    *p = '\0';
    return s;
}

int main() {
    char buffer[81];
    printf("Enter a string no longer than 80 characters:\n");
    my_gets(buffer);
    printf("%s\n", buffer);
}
