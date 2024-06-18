/*
 * terminating_loop.c (c) 2024 Christopher A. Bohn
 */

#include <stdio.h>
#include <unistd.h>

#define MS_PER_uS 1000

int main() {
#if defined (__STDC_IEC_60559_DFP__)
    _Decimal32 x;
    int duration = 100 * MS_PER_uS;
    for (x = 0.0df; x != 10.0df; x += 0.1df) {
        printf("x = %Ha\n", x);
        usleep(duration);
    }
#else
    printf("Your compiler does not yet fully support decimal floating point types.\n");
#endif //__STDC_IEC_60559_DFP__
}
