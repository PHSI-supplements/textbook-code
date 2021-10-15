#include "cowpi.h"

volatile struct gpio_registers *gpio = (struct gpio_registers *)(IObase + 0x3);
volatile struct timer_registers_8bit *mytimer0 = (struct timer_registers_8bit *)(IObase + 0x24);
volatile struct timer_registers_8bit *mytimer2 = (struct timer_registers_8bit *)(IObase + 0x90);

uint32_t time = 0, mytime = 0;
uint8_t now = 0, then = 0;

void setup() {
  mytimer2->control |= 0x0003;    // Mode: Fast PWM
  mytimer2->control |= 0x0400;    // Prescaler: 64 -- pay attention!
  gpio[D8_D13].direction |= 0x30; // D12 & D13:  output
}

void loop() {
  time = millis();
  then = now;
  now = mytimer2->counter;
  if (now < then) // overflow?
    mytime++;
  if (time & 0x0400)
    gpio[D8_D13].output |= 0x20;
  else
    gpio[D8_D13].output &= ~(0x20);
  if (mytime & 0x0400)
    gpio[D8_D13].output |= 0x10;
  else
    gpio[D8_D13].output &= ~(0x10);
}
