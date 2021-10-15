#include "cowpi.h"

volatile struct gpio_registers *gpio = (struct gpio_registers *)(IObase + 0x3);
volatile struct timer_registers_8bit *mytimer0 = (struct timer_registers_8bit *)(IObase + 0x24);
volatile struct timer_registers_16bit *mytimer1 = (struct timer_registers_16bit *)(IObase + 0x60);
volatile uint8_t *timer_interrupt_mask = IObase + 0x4E;

uint32_t time = 0;

void setup() {
  mytimer1->control  = 0x00000500;  // Prescaler: 1024
  mytimer1->control |= 0x00000800;  // clear timer on compare match
  // interrupt (and clear counter) every 15,625 beats
  mytimer1->counter  = 0;
  mytimer1->compareA = 15625;
  timer_interrupt_mask[1] |= 0x02;
  gpio[D8_D13].direction |= 0x30; 	// D12 & D13:  output
}

ISR(TIMER1_COMPA_vect) {
  gpio[D8_D13].output ^= 0x10;
}

void loop() {
  time = millis();
  if (time & 0x0400)
    gpio[D8_D13].output |= 0x20;
  else
    gpio[D8_D13].output &= ~(0x20);
}
