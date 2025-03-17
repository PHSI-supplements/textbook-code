#include <stdio.h>
#include <stdlib.h>
#include <math.h>
#include <errno.h>
#include <limits.h>
#include "menu.h"

void *select_option(menu_option_t const *options, int number_of_options) {
    int offset = (int) ceil(log10(number_of_options));
    char buffer[80];
    unsigned long option = ULONG_MAX;
    void *selection;
    printf("\n");
    do {
        for (unsigned int i = 0; i < number_of_options; i++) {
            printf("%*d. %s\n", offset, i + 1, options[i].description);
        }
        printf("%*d. Quit\n", offset, 0);
        buffer[0] = '\0';
        printf("Select your option: ");
        fflush(stdout);
        scanf("%79s", buffer);
        buffer[79] = '\0';
        option = strtol(buffer, nullptr, 10);
        if (option > number_of_options) {
            printf("Invalid option %ld. Please select an option between 0 and %d.\n", option, number_of_options);
        } else if (option == 0) {
            if (errno == EINVAL) {
                printf("Invalid option (%s). Please select a number between 0 and %d.\n", buffer, number_of_options);
                errno = 0;
                option = ULONG_MAX;
            } else {
                selection = nullptr;
            }
        } else {
            selection = options[option - 1].option;
        }
        printf("\n");
    } while (option > number_of_options);
    fflush(stdin);
    fflush(stdout);
    return selection;
}