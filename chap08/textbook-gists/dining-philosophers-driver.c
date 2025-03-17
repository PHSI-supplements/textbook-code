#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include "menu.h"
#include "DiningPhilosophers/dining-philosophers.h"

menu_option_t const names[] = {
        {.option = "Stu Dent", .description = "Stu Dent"},
        {.option = "Dee Veloper", .description = "Dee Veloper"},
        {.option = "Connie Seur", .description = "Connie Seur"},
        {.option = "Phil A. Mignon", .description = "Phil A. Mignon"},
        {.option = "Kate Turing", .description = "Kate Turing"},
        {.option = nullptr, .description = "(other)"},
};

menu_option_t const strategies[] = {
        {.option = basic_philosopher, .description = "Basic philosopher"},
        {.option = polite_philosopher, .description = "Polite philosopher"},
        {.option = starving_philosopher, .description = "Starve philosopher 1"},
        {.option = nullptr, .description = "(default)"}
};


int main() {
    philosopher_state_t thinking = THINKING;
    philosopher_state_t hungry = HUNGRY;
    /* a philosopher cannot start off eating */
    menu_option_t const initial_states[] = {
            {.option = &thinking, .description = "Thinking"},
            {.option = &hungry, .description = "Hungry"},
    };
    char buffer[80];
    printf("How many philosophers? ");
    scanf("%79s", buffer);
    buffer[79] = '\0';
    int number_of_philosophers = (int) strtol(buffer, nullptr, 10);
    printf("\n");
    philosopher_t philosophers[number_of_philosophers];
    for (int i = 0; i < number_of_philosophers; i++) {
        printf("Select a philosopher's name.\n");
        char *name = select_option(names, sizeof(names) / sizeof(menu_option_t));
        if (name != nullptr) {
            philosophers[i].name = name;
        } else {
            printf("What is the philosopher's name? ");
            scanf("%79s", buffer);
            buffer[79] = '\0';
            printf("\n");
            name = buffer;
            philosophers[i].name = malloc(strlen(name));
            strcpy(philosophers[i].name, name);
        }
        printf("Select %s's strategy.\n", name);
        philosophers[i].strategy = select_option(strategies, sizeof(strategies) / sizeof(menu_option_t));
        printf("What is %s's initial state?\n", name);
        philosophers[i].initial_state = *(int *) select_option(initial_states, sizeof(initial_states) / sizeof(menu_option_t));
    }
    printf("How long with the philosophers dine, in seconds? ");
    scanf("%79s", buffer);
    buffer[79] = '\0';
    int runtime = (int) strtol(buffer, nullptr, 10);
    printf("\n");
    start_dining(philosophers, number_of_philosophers, runtime);
}
