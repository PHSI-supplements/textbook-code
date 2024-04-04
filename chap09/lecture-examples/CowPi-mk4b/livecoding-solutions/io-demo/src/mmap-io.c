#include <CowPi.h>
#include <stdint.h>
#include "mmap-io.h"

cowpi_ioport_t volatile *gpio = (cowpi_ioport_t *)(0xD0000000);

void basic_input_output(void) {
    // printf("In basic_input_output.\n");
    uint32_t right_switch, left_button;

    right_switch = gpio->input & (1 << 15);     // GP15
    left_button =  gpio->input & (1 << 2);      // GP02

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
    // printf("In timer_blink_nonblocking.\n");
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
    // call basic_input_output to demonstrate that this function has no blocking code 
    basic_input_output();
}
