/*
 * CowPi lecture examples (c) 2021-24 Christopher A. Bohn
 */

/* BE SURE TO PRE-COMPILE THE DEPENDENCIES BEFORE LECTURE! */

#include <CowPi.h>
#include <OneBitDisplay.h>
#include <InterruptIn.h>
#include <Ticker.h>
#include "mmap-io.h"
#include "interrupt-io.h"

typedef struct {
    void (*function)(void);
    char const *name;
} demonstration_t;

static uint8_t backbuffer[1024];
static OBDISP display;

void configure_display(void);
int get_demonstration_number(void);
void set_button_interrupts(void);
void set_ticker(void);


demonstration_t demonstrations[] = {
    (demonstration_t){.function = basic_input_output, .name = "Basic I/O"},
    (demonstration_t){.function = read_timer, .name = "Read Timer"},
    (demonstration_t){.function = timer_blink_blocking, .name = "Timer Blink (blocking)"},
    (demonstration_t){.function = timer_blink_nonblocking, .name = "Timer Blink (non-blocking)"},
    (demonstration_t){.function = normal_code, .name = "Handle right button with interrupts"},
    (demonstration_t){.function = normal_code, .name = "Use a timer interrupt"}
};
int demonstration_to_run = -1;
int const button_interrupt_demonstration = 4;
int const ticker_demonstration = 5;

/* SETTING UP THE DEMONSTRATION ENVIRONMENT */


void setup() {
    cowpi_setup(9600,
                (cowpi_display_module_t) {.display_module = NO_MODULE},
                (cowpi_display_module_protocol_t) {.protocol = NO_PROTOCOL}
    );
    configure_display();
    demonstration_to_run = get_demonstration_number();
    if (demonstration_to_run == button_interrupt_demonstration) {
        set_button_interrupts();
    }
    if (demonstration_to_run == ticker_demonstration) {
        set_ticker();
    }
    printf("You selected %d, %s.\n", demonstration_to_run, demonstrations[demonstration_to_run].name);
}

void loop() {
    demonstrations[demonstration_to_run].function();
}

void configure_display(void) {
    obdI2CInit(&display, OLED_128x64, -1, 0, 0, 1, -1, -1, -1, 400000L);
    obdSetBackBuffer(&display, backbuffer);
    obdFill(&display, OBD_WHITE, 0);
    // memcpy(backbuffer, logo, 1024);
    char output[5][17];
    strcpy(output[0], "  MEMORY-MAPPED ");
    strcpy(output[1], "        &       ");
    strcpy(output[2], "INTERRUPT-DRIVEN");
    strcpy(output[3], "  INPUT/OUTPUT  ");
    strcpy(output[4], " DEMONSTRATIONS ");
    obdWriteString(&display, 0, 0, 8, output[0], FONT_8x8, OBD_BLACK, 0);
    obdWriteString(&display, 0, 0, 16, output[1], FONT_8x8, OBD_BLACK, 0);
    obdWriteString(&display, 0, 0, 24, output[2], FONT_8x8, OBD_BLACK, 0);
    obdWriteString(&display, 0, 0, 40, output[3], FONT_8x8, OBD_BLACK, 0);
    obdWriteString(&display, 0, 0, 56, output[4], FONT_8x8, OBD_BLACK, 0);
    obdDumpBuffer(&display, backbuffer);
}

int get_demonstration_number(void) {
    // this size calculation works only because the number of elements is known at compile-time
    int number_of_demonstrations = sizeof(demonstrations) / sizeof(demonstration_t);
    printf("Select the demonstration: \n");
    for (int i = 0; i < number_of_demonstrations; i++) {
        printf("%d. %s\n", i, demonstrations[i].name);
    }
    char input[10];
    int choice = -1;
    do {
        scanf("%9s", input);
        if (isdigit(input[0])) {
            sscanf(input, "%d", &choice);
        }
        if (choice < 0 || choice >= number_of_demonstrations) {
            printf("Please select a non-negative number less than %d.\n", number_of_demonstrations);
            choice = -1;
        }
    } while (choice == -1);
    return choice;
}

void set_button_interrupts(void) {
    ;
}

void set_ticker(void) {
    ;
}
