#include "CowPi.h"

volatile cowpi_ioport_t *gpio = (cowpi_ioport_t *)(cowpi_io_base + 3);

void setup() {
  cowpi_setup(0);   // nothing special needed for simple I/O examples
}

void loop() {
  static uint8_t left_switch, right_switch, left_button, right_button;
  left_switch   = gpio[D8_D13].input & (1 << 3);  // D11
  right_switch  = gpio[D8_D13].input & (1 << 2);  // D10
  left_button   = gpio[D8_D13].input & 1;         // D8
  right_button  = gpio[D8_D13].input & (1 << 1);  // D9
  if (left_button) {  // button is not pressed
      gpio[D8_D13].output &= ~(1 << 5); // turn LED at D13 off
  } else {
      gpio[D8_D13].output |= (1 << 5);  // turn LED at D13 on
  }
  if (right_switch) {
      gpio[D8_D13].output |= (1 << 4);  // turn LED at D12 on
  } else {
      gpio[D8_D13].output &= ~(1 << 4); // turn LED at D12 off
  }
}
