/*
 * struct_alignment.c (c) 2018-20 Christopher A. Bohn
 */

#include <stdio.h>

struct hat1 {
    char *brand;
    int size;
    char *color;
};

struct hat2 {
    char *brand;
    short inspected_by;
    int size;
    char *color;
};

struct hat3 {
    char *brand;
    int size;
    char *color;
    short inspected_by;
};

const char *lines[] = {
        "struct hat",
        "    char *brand;",
        "    int size;",
        "    char *color;",
        "};",
        "    short inspected_by;",
        "    (padding)"
};

int main() {
    struct hat1 x;
    struct hat2 y;
    struct hat3 z;
    printf("%s\n%s\n%s\n%s\n%s\n", lines[0], lines[1], lines[2], lines[3], lines[4]);
    printf("BASE ADDRESS: %p\n", &x);
    printf("%8s%38s   %s\n", "LINE", "LOWER ADDRESS (inclusive)", "UPPER ADDRESS (exclusive)");
    printf("%s%30p - %p\n", lines[1], &x.brand, &x.brand + 1);
    printf("%s%33p - %p\n", lines[2], &x.size, &x.size + 1);
    printf("%s%33p - %p\n", lines[6], &x.size + 1, &x.color);
    printf("%s%30p - %p\n\n", lines[3], &x.color, &x.color + 1);
    printf("%s\n%s\n%s\n%s\n%s\n%s\n", lines[0], lines[1], lines[5], lines[2], lines[3], lines[4]);
    printf("BASE ADDRESS: %p\n", &y);
    printf("%8s%38s   %s\n", "LINE", "LOWER ADDRESS (inclusive)", "UPPER ADDRESS (exclusive)");
    printf("%s%30p - %p\n", lines[1], &y.brand, &y.brand + 1);
    printf("%s%23p - %p\n", lines[5], &y.inspected_by, &y.inspected_by + 1);
    printf("%s%33p - %p\n", lines[6], &y.inspected_by + 1, &y.size);
    printf("%s%33p - %p\n", lines[2], &y.size, &y.size + 1);
    printf("%s%30p - %p\n\n", lines[3], &y.color, &y.color + 1);
    printf("%s\n%s\n%s\n%s\n%s\n%s\n", lines[0], lines[1], lines[2], lines[3], lines[5], lines[4]);
    printf("BASE ADDRESS: %p\n", &z);
    printf("%8s%38s   %s\n", "LINE", "LOWER ADDRESS (inclusive)", "UPPER ADDRESS (exclusive)");
    printf("%s%30p - %p\n", lines[1], &z.brand, &z.brand + 1);
    printf("%s%33p - %p\n", lines[2], &z.size, &z.size + 1);
    printf("%s%33p - %p\n", lines[6], &z.size + 1, &z.color);
    printf("%s%30p - %p\n", lines[3], &z.color, &z.color + 1);
    printf("%s%23p - %p\n", lines[5], &z.inspected_by, &z.inspected_by + 1);
    printf("%s%33p - %p\n\n", lines[6], &z.inspected_by + 1, &z + 1);
    return 0;
}
