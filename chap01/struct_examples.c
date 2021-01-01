/*
 * struct_examples.c (c) 2018-20 Christopher A. Bohn
 */

#include <stdio.h>
#include "enum_examples.h"

struct hat {
	int size;
	char *color;
};

typedef enum days day;
typedef struct hat headwear;

typedef struct {
    int value;
    suits suit;
} card;

void displayHat( struct hat *the_hat ) {
	printf( "Size %d %s hat.\n", (*the_hat).size, the_hat->color);
}

int main() {
	struct hat h1, h2;
	h1.size = 3;
	h1.color = "blue";
	printf("size=%d, color=%s\n",h1.size, h1.color);
	displayHat(&h1);

    day d = MONDAY;
    headwear h = {.size = 9, .color = "brown"};
    displayHat(&h);

    card c = {.value=3, .suit=DIAMONDS};
}
