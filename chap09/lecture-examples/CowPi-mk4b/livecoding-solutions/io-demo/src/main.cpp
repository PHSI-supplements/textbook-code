/*
 * CowPi lecture examples (c) 2021-24 Christopher A. Bohn
 */

/* BE SURE TO PRE-COMPILE THE DEPENDENCES BEFORE LECTURE! */

#include <CowPi.h>
#include <OneBitDisplay.h>

typedef struct {
    void (*function)(void);
    char const *name;
} demonstration_t;

static uint8_t backbuffer[1024];
static OBDISP display;

void configure_display(void);
int get_demonstration_number(void);
void basic_input_output(void);
void read_timer(void);
void timer_blink_blocking(void);
void timer_blink_nonblocking(void);

demonstration_t demonstrations[] = {
    (demonstration_t){.function = basic_input_output, .name = "Basic I/O"},
    (demonstration_t){.function = read_timer, .name = "Read Timer"},
    (demonstration_t){.function = timer_blink_blocking, .name = "Timer Blink (blocking)"},
    (demonstration_t){.function = timer_blink_nonblocking, .name = "Timer Blink (non-blocking)"},
};
int demonstration_to_run = -1;


/* SETTING UP THE DEMONSTRATION ENVIRONMENT */


void setup() {
    cowpi_setup(9600,
                (cowpi_display_module_t) {.display_module = NO_MODULE},
                (cowpi_display_module_protocol_t) {.protocol = NO_PROTOCOL}
    );
    configure_display();
    demonstration_to_run = get_demonstration_number();
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
    char output[3][17];
    strcpy(output[0], "  MEMORY-MAPPED ");
    strcpy(output[1], "  INPUT/OUTPUT  ");
    strcpy(output[2], " DEMONSTRATIONS ");
    obdWriteString(&display, 0, 0, 8, output[0], FONT_8x8, OBD_BLACK, 0);
    obdWriteString(&display, 0, 0, 24, output[1], FONT_8x8, OBD_BLACK, 0);
    obdWriteString(&display, 0, 0, 40, output[2], FONT_8x8, OBD_BLACK, 0);
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


/* THE DEMONSTRATIONS */


cowpi_ioport_t volatile *gpio = (cowpi_ioport_t *)(0xD0000000);

void basic_input_output(void) {
    // printf("In basic_input_output.\n");
    uint32_t right_switch, left_button;

    // left_switch =  gpio->input & (1 << 14);     // GP14
    right_switch = gpio->input & (1 << 15);     // GP15
    left_button =  gpio->input & (1 << 2);      // GP02
    // right_button = gpio->input & (1 << 3);      // GP03

    if (left_button) {              // button is not pressed
        gpio->output &= ~(1 << 21);             // turn LED at GP21 off
    } else {
        gpio->output |=  (1 << 21);             // turn LED at GP21 on
    }

    if (right_switch) {             // switch is toggled to the right
        gpio->output |=  (1 << 20);             // turn LED at GP20 on
    } else {
        gpio->output &= ~(1 << 20);             // turn LED at GP20 off
    }
}

cowpi_timer_t volatile *timer = (cowpi_timer_t *)(0x40054000);

void read_timer(void) {
    // printf("In read_timer.\n");
    uint32_t counter_lower_word = timer->lower_word;
    uint64_t counter = ((uint64_t) (timer->upper_word) << 32) | counter_lower_word;
    printf("Time: %08lu%08lu\n", (uint32_t) (counter >> 32), (uint32_t) (counter & 0xFFFFFFFF));
    counter_lower_word = timer->raw_lower_word;
    printf("Time:         %08lu\n", counter_lower_word);
}

void timer_blink_blocking(void) {
    // digitalWrite(LED_BUILTIN, HIGH);
    // delay(1000);
    // digitalWrite(LED_BUILTIN, LOW);
    // delay(1000);

    uint32_t then;
    gpio->output |=  (1 << 25);
    then = timer->raw_lower_word;
    while (timer->raw_lower_word - then < 1000000) {}
    gpio->output &= ~(1 << 25);
    then = timer->raw_lower_word;
    while (timer->raw_lower_word - then < 1000000) {}
}

void timer_blink_nonblocking(void) {
    // printf("In timer_blink_blocking.\n");
    static uint32_t last_change = 0;
    static bool is_illuminated = false;
    uint32_t now = timer->raw_lower_word;
    if (now - last_change >= 1000000) {
        last_change = now;
        is_illuminated = !is_illuminated;
        if (is_illuminated) {
            gpio->output |=  (1 << 25);
        } else {
            gpio->output &= ~(1 << 25);
        }
    }
    basic_input_output();
}