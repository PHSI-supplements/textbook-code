/*
 * accidental_overflow.c (c) 2018-20 Christopher A. Bohn
 */

#include <stdio.h>
#include <string.h>

/* more readable strcpy: copy t to s */
void readable_strcpy(char *s, const char *t) {
    char c;
    long i = 0;
    do {
        c = t[i];
        s[i] = c;
        i++;
    } while (c != '\0');
}

int main() {
    char string1[5] = "Hi!";
    char string2[5] = "Hello";
    printf("First print--\tstring1: %s\tstring2: %s\n", string1, string2);
    char string3[6] = "Hello";
    strcpy(string2, string3);
    printf("Second print--\tstring1: %s\tstring2: %s\n", string1, string2);
    readable_strcpy(string1, "Hi!");
    printf("Third print--\tstring1: %s\tstring2: %s\n", string1, string2);
    readable_strcpy(string2, string3);
    printf("Fourth print--\tstring1: %s\tstring2: %s\n", string1, string2);
    return 0;
}