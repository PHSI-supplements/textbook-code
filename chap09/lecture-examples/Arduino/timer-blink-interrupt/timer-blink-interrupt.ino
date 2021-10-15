#include "cowpi.h"

volatile struct gpio_registers *gpio = (struct gpio_registers *)(IObase + 0x3);
volatile struct timer_registers_8bit *mytimer0 = (struct timer_registers_8bit *)(IObase + 0x24);
volatile struct timer_registers_8bit *mytimer2 = (struct timer_registers_8bit *)(IObase + 0x90);
volatile uint8_t *timer_interrupt_mask = IObase + 0x4E;

uint32_t time = 0;
volatile uint32_t mytime = 0;

void setup() {
  timer_interrupt_mask[0] |= 0x02;  // enable "compare match A" interrupt
  mytimer0->compareA = 0x80;     	  // compare to 0x80 (halfway between overflows)
  gpio[D8_D13].direction |= 0x30; 	// D12 & D13:  output
}

ISR(TIMER0_COMPA_vect) {
  mytime++;
}

void loop() {
  time = millis();
  if (time & 0x0400)
    gpio[D8_D13].output |= 0x20;
  else
    gpio[D8_D13].output &= ~(0x20);
  if (mytime & 0x0400)
    gpio[D8_D13].output |= 0x10;
  else
    gpio[D8_D13].output &= ~(0x10);
}
