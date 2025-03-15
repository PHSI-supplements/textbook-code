/*
 * loopindexing.c (c) 2018-20 Christopher A. Bohn
 */

#include <stdio.h>
#include <time.h>

#define RANGE 16384

int src1[RANGE][RANGE];
int src2[RANGE][RANGE];
int dest[RANGE][RANGE];

int main() {
    clock_t start1, finish1, start2, finish2;
    int i, j;
    for (i = 0; i < RANGE; i++)
        for (j = 0; j < RANGE; j++)
            dest[i][j] = src1[i][j] = src2[i][j] = i;

    start1 = clock();
    for (i = 0; i < RANGE; i++)
        for (j = 0; j < RANGE; j++) {
            dest[i][j] = src1[i][j];
            //printf("Row Major indexing : %d,%d\n",i,j);
        }
    finish1 = clock();

    start2 = clock();
    for (j = 0; j < RANGE; j++)
        for (i = 0; i < RANGE; i++) {
            dest[i][j] = src2[i][j];
            //printf("Column Major indexing : %d,%d\n",i,j);
        }
    finish2 = clock();

    printf("Row Major indexing took %f seconds.\n", ((double)finish1 - start1) / CLOCKS_PER_SEC);
    printf("Column Major indexing took %f seconds.\n", ((double)finish2 - start2) / CLOCKS_PER_SEC);

}
