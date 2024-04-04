#include <CowPi.h>
#include "interrupt-io.h"

static int volatile interrupt_count = 0;

void normal_code(void) {
    static int last_interrupt_count = 0;
    if (interrupt_count != last_interrupt_count) {
        printf("interrupt count: %d\n", interrupt_count);
        last_interrupt_count = interrupt_count;
    }
    if (cowpi_left_button_is_pressed()) {
        cowpi_illuminate_internal_led();
    } else {
        cowpi_deluminate_internal_led();
    }
}

void flip_leds(void) {
    static bool led_state = false;
    interrupt_count++;
    led_state = !led_state;
    if (led_state) {
        cowpi_illuminate_left_led();
        cowpi_deluminate_right_led();
    } else {
        cowpi_illuminate_right_led();
        cowpi_deluminate_left_led();
    }
}
