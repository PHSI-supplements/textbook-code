#ifndef MENU_H
#define MENU_H

typedef struct {
    void *option;
    char *description;
} menu_option_t;

void *select_option(menu_option_t const *options, int number_of_options);

#endif //MENU_H
