/*
 * dont_use_break.c (c) 2018-20 Christopher A. Bohn
 */

#include <stdio.h>
#include <string.h>
#include <stdlib.h>
#include <stdbool.h>

/* Code from K&R, The C Programming Language, 2nd ed., page 65. I do not claim copyright on it (obviously). */
int trim1(char s[]) {
    int n;
    for (n = (int)strlen(s)-1; n >= 0; n--)
        if (s[n] != ' ' && s[n] != '\t' && s[n] != '\n')
            break;
    s[n+1] = '\0';
    return n;
}

/* Functionally-equivalent code. */
int trim2(char s[]) {
    int n = (int)strlen(s)-1;
    bool done = false;
    while (!done) {
        if (s[n] != ' ' && s[n] != '\t' && s[n] != '\n') {
            n++;
            done = true;
        }
        if (--n < 0)
            done = true;
    }
    s[n+1] = '\0';
    return n;
}

int main(int argc, char *argv[]) {
    char *s[] = {"foo","bar  ","baz\t\t  \t","quux \n \n", "b", "", "    "};
    char *s1 = malloc(256);
    char *s2 = malloc(256);
    for (int i=0; i<7; i++) {
        printf("size %lu\n",strlen(s[i]));
        printf(".%s.\n", s[i]);
        strncpy(s1, s[i], 256);
        strncpy(s2, s[i], 256);
        printf("trim1 %d\ttrim2 %d\n", trim1(s1), trim2(s2));
        printf(".%s.\n", s1);
        printf(".%s.\n", s2);
    }
}
