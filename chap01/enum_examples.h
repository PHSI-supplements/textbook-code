/*
 * enum_examples.h (c) 2018-20 Christopher A. Bohn
 */

#ifndef TEXTBOOK_CODE_ENUM_EXAMPLES_H
#define TEXTBOOK_CODE_ENUM_EXAMPLES_H

enum days {
    MONDAY,
    TUESDAY,
    WEDNESDAY,
    THURSDAY,
    FRIDAY,
    SATURDAY,
    SUNDAY
};

typedef enum {
    CLUBS, DIAMONDS, HEARTS, SPADES
} suits;

char *print_suit(suits suit, char *suit_string);

#endif //TEXTBOOK_CODE_ENUM_EXAMPLES_H
