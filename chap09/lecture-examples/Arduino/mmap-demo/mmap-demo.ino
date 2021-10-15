#include "cowpi.h"

struct gpio_registers *gpio = (struct gpio_registers *)(IObase + 3);
uint8_t left_switch, right_switch, left_button, right_button;

void setup() {
  gpio[A0_A5].direction   &= 0b11001111;  // Even though it's default, make sure A4 and A5 are set to input
  gpio[A0_A5].output      &= 0b11001111;  // Even though it's default, make sure A4 and A5 are set to Hi-Z
  gpio[D8_D13].direction  &= 0b11111100;  // Even though it's default, make sure D8 and D9 are set to input
  gpio[D8_D13].output     |= 0b00000011;  // Pull D8 and D9 high
  gpio[D8_D13].direction  |= 0b00110000;  // Set D12 and D13 to output
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
