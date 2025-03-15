/*
 * dont_use_break.c (c) 2018-24 Christopher A. Bohn
 */

#include <stdio.h>
#include <string.h>
#include <stdlib.h>
#include <stdbool.h>

/* Code from K&R, The C Programming Language, 2nd ed., page 65. I do not claim copyright on it (obviously). */
int trim1(char s[]) {
    int n;
    for (n = (int) strlen(s) - 1; n >= 0; n--)
        if (s[n] != ' ' && s[n] != '\t' && s[n] != '\n')
            break;
    s[n + 1] = '\0';
    return n;
}

/* Functionally-equivalent code that uses the "!done" idiom. */
int trim2(char s[]) {
    int n = (int) strlen(s) - 1;
    bool has_trailing_whitespace = true;
    while (has_trailing_whitespace) {
        if (s[n] != ' ' && s[n] != '\t' && s[n] != '\n') {
            n++;
            has_trailing_whitespace = false;
        }
        if (--n < 0)
            has_trailing_whitespace = false;
    }
    s[n + 1] = '\0';
    return n;
}

/* Functionally-equivalent code that moves the terminating condition into the loop condition */
int trim3(char s[]) {
    int n = (int) strlen(s) - 1;
    while ((n >= 0) && !(s[n] != ' ' && s[n] != '\t' && s[n] != '\n')) {
        n--;
    }
    s[n + 1] = '\0';
    return n;
}

/* Application of DeMorgan's Law eliminates the double-negatives */
int trim4(char s[]) {
    int n = (int) strlen(s) - 1;
    while ((n >= 0) && (s[n] == ' ' || s[n] == '\t' || s[n] == '\n')) {
        n--;
    }
    s[n + 1] = '\0';
    return n;
}

#import <ctype.h>

/* We can make this pretty readable if we're allowed to also remove '\f', '\r', and '\v' */
int trim5(char s[]) {
    int n = (int) strlen(s) - 1;
    while ((n >= 0) && isspace(s[n])) {
        n--;
    }
    s[n + 1] = '\0';
    return n;
}

int main(int argc, char *argv[]) {
    char *s[] = {"foo", "bar  ", "baz\t\t  \t", "quux \n \n", "b", "", "    "};
    char *s1 = malloc(256);
    char *s2 = malloc(256);
    char *s3 = malloc(256);
    for (int i = 0; i < 7; i++) {
        printf("size %lu\n", strlen(s[i]));
        printf(".%s.\n", s[i]);
        strncpy(s1, s[i], 256);
        strncpy(s2, s[i], 256);
        strncpy(s3, s[i], 256);
        printf("trim1 %d\ttrim2 %d\ttrim4 %d\n", trim1(s1), trim2(s2), trim4(s3));
        printf(".%s.\n", s1);
        printf(".%s.\n", s2);
        printf(".%s.\n", s3);
    }
}
