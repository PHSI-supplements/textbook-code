#include "cowpi.h"

cowpi_ioPortRegisters *gpio = (cowpi_ioPortRegisters *)(cowpi_IObase + 3);
uint8_t left_switch, right_switch, left_button, right_button;

void setup() {
  cowpi_setup(0);   // nothing special needed for simple I/O examples
}

void loop() {
  left_switch   = gpio[A0_A5].input & (1 << 4);   // A4
  right_switch  = gpio[A0_A5].input & (1 << 5);   // A5
  left_button   = gpio[D8_D13].input & 1;         // D8
  right_button  = gpio[D8_D13].input & (1 << 1);  // D9
  if (left_button) {  // button is not pressed
      gpio[D8_D13].output &= ~(1 << 4); // turn LED at D12 off
  } else {
      gpio[D8_D13].output |= (1 << 4);  // turn LED at D12 on
  }
  if (right_switch) {
      gpio[D8_D13].output |= (1 << 5);  // turn LED at D13 on
  } else {
      gpio[D8_D13].output &= ~(1 << 5); // turn LED at D13 off
  }
}
