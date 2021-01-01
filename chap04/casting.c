/*
 * casting.c (c) 2018-20 Christopher A. Bohn
 */

#include <stdio.h>

void cast_to_larger_type(short x);
void cast_to_smaller_type(int x);
void cast_implicitly_to_unsigned(int x, unsigned int y);
void cast_int_to_float(int i);
void cast_float_to_int(float f);

int main() {
    cast_to_larger_type(0x4E95);
    cast_to_smaller_type(0x19E10);
    cast_implicitly_to_unsigned(-1, 0);
    cast_int_to_float(5483);
    cast_float_to_int(54.83);
}

void cast_to_larger_type(short x) {
    int y = (int)x;
    printf("Casting from short to int:\t\tx = %d\ty = %d\n", x, y);
}

void cast_to_smaller_type(int x) {
    int y = (short)x;
    printf("Casting from int to short:\t\tx = %d\ty = %d\n", x, y);
}

void cast_implicitly_to_unsigned(int x, unsigned int y) {
    printf("Implicitly casting from int to unsigned int:\t");
    printf("%d %c %d\n", x, (x<y ? '<' : '>'), y);
}

void cast_int_to_float(int i) {
    float f = (float)i;
    printf("Casting from int to float:\t\ti = %d\tf = %f\n", i, f);
}

void cast_float_to_int(float f) {
    int i = (int)f;
    printf("Casting from float to int:\t\tf = %f\ti = %d\n", f, i);
}

