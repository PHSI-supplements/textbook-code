#include <CowPi.h>
#include <stdint.h>
#include "mmap-io.h"

void basic_input_output(void) {
    printf("In basic_input_output.\n");
}

void read_timer(void) {
    printf("In read_timer.\n");
}

void timer_blink_blocking(void) {
    digitalWrite(LED_BUILTIN, HIGH);
    delay(1000);
    digitalWrite(LED_BUILTIN, LOW);
    delay(1000);
}

void timer_blink_nonblocking(void) {
    printf("In timer_blink_nonblocking.\n");

    // call basic_input_output to demonstrate that this function has no blocking code
    basic_input_output();
}
