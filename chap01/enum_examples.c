/*
 * enum_examples.c (c) 2018-20 Christopher A. Bohn
 */

#include <stdio.h>
#include "enum_examples.h"

int main() {
    enum days day = WEDNESDAY;
    printf("%d\n", day);

    char suitString[9] = "";
    suits s = HEARTS;
    printf("%s\n", print_suit(s, suitString));
}

char *print_suit(suits suit, char *suit_string) {
    switch (suit) {
        case CLUBS:
            suit_string = "CLUBS";
            break;
        case DIAMONDS:
            suit_string = "DIAMONDS";
            break;
        case HEARTS:
            suit_string = "HEARTS";
            break;
        case SPADES:
            suit_string = "SPADES";
            break;
        default:
            suit_string = "UNKNOWN";
    }
    return suit_string;
}
