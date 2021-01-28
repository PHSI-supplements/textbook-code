/*
 * show_limits.c (c) 2018-20 Christopher A. Bohn
 */

#include <stdio.h>
#include <limits.h>
#include <float.h>

int main() {
    printf("Information from limits.h, float.h and sizeof():\n");
    printf("There are %d bits in a char.\n", CHAR_BIT);
    printf("There are %d bits in an int.\n", WORD_BIT);
    printf("There are %ld bytes in a pointer.\n\n", sizeof(void *));
    printf("Type        Bytes              Minimum Value                Maximum Value\n");
    printf("-------------------------------------------------------------------------\n");
    printf("%9s %5ld %28d %28d\n", "char", sizeof(char), CHAR_MIN, CHAR_MAX);
    printf("%9s %5ld %28d %28d\n", "short", sizeof(short), SHRT_MIN, SHRT_MAX);
    printf("%9s %5ld %28d %28d\n", "int", sizeof(int), INT_MIN, INT_MAX);
    printf("%9s %5ld %28ld %28ld\n", "long", sizeof(long), LONG_MIN, LONG_MAX);
    printf("%9s %5ld %28lld %28lld\n\n", "long long", sizeof(long long), LLONG_MIN, LLONG_MAX);
    printf("                    Significand   Max    Min        Max               Min\n");
    printf("Type         Bytes      Bits       Exponent        Finite           Normal\n");
    printf("-------------------------------------------------------------------------------\n");
    printf("%11s %4ld %10d %9d %6d   %-15.5e %-17.8e\n",
           "float", sizeof(float), FLT_MANT_DIG, FLT_MIN_EXP, FLT_MAX_EXP, FLT_MAX, FLT_MIN);
    printf("%11s %4ld %10d %9d %6d   %-15.5e %-17.8e\n",
           "double", sizeof(double), DBL_MANT_DIG, DBL_MIN_EXP, DBL_MAX_EXP, DBL_MAX, DBL_MIN);
    printf("%11s %4ld %10d %9d %6d   %-15.5Le %-17.8Le\n",
           "long double", sizeof(long double), LDBL_MANT_DIG, LDBL_MIN_EXP, LDBL_MAX_EXP, LDBL_MAX, LDBL_MIN);
    /*
     * Output for gcc long double on x86:
     * long double   16         64    -16381  16384   1.18973e+4932   3.36210314e-4932
     *
     * Output for gcc long double on x86 with -mlong-double-128:
     * long double   16        113    -16381  16384   -nan            -nan
     */
}
