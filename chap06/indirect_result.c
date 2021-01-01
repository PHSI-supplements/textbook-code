#pragma clang diagnostic push
#pragma clang diagnostic ignored "-Wunknown-pragmas"
#pragma ide diagnostic ignored "UnusedValue"
#pragma ide diagnostic ignored "UnusedLocalVariable"
#pragma ide diagnostic ignored "OCUnusedGlobalDeclarationInspection"
/*
 * indirect_result.c (c) 2018-20 Christopher A. Bohn
 */

typedef struct {
    int a;
    long b;
    long c;
    long d;
} foo;

foo bar(int a, long b, long c, long d) {
    foo baz;
    baz.a = a;
    baz.b = b;
    baz.c = c;
    baz.d = d;
    return baz;     // since baz itself can't fit in a register, baz is indirectly returned by returning a pointer to baz
}

void quux() {
    foo x = bar(2,3,4,5);
}
#pragma clang diagnostic pop