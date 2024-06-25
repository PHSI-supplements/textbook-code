/*
 * chap05/lecture-examples.c (c) 2021 Christopher A. Bohn
 */

char add_chars(char a, char b);
char add_shorts(short a, short b);
long add_two_numbers(long a, long b);

void add_and_save(long x, long y, long *destination) {
    long z = add_two_numbers(x, y);
    *destination = z;
}

int demonstrate_suffixes() {
    char c = 1 + 2;
    short s = 3 + 4;
    int i = 5 + 6;
    long l = 7 + 8;
}

int demonstrate_promotion() {
    char c = add_chars(1, 2);
    char d = add_chars(5, 6);
    short s = add_shorts(3, 4);
    c = c + d;
    s = s | c;
    return s;
}

long array_on_stack(long j) {
    long i[16];     // this won't end well
    return i[j];
}

long global_array[16];

long access_global_array(long j) {
    return global_array[j];
}

void swap(long *p, long *q) {
    long r = *p;
    long s = *q;
    *p = s;
    *q = r;
}

void my_print(const char *a_string);

void hello_world() {
    char hello[] = "Hello, World!";
    my_print(hello);
}

long multiply_by_48(long i) {
    return 48 * i;
}

long my_add(long i, long j) {
    return i + j;
}


