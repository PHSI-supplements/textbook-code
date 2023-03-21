#include "cowpi.h"

cowpi_ioPortRegisters *gpio = (cowpi_ioPortRegisters *)(cowpi_IObase + 0x3);
cowpi_timerRegisters8bit *mytimer0 = (cowpi_timerRegisters8bit *)(cowpi_IObase + 0x24);
cowpi_timerRegisters16bit *mytimer1 = (cowpi_timerRegisters16bit *)(cowpi_IObase + 0x60);
volatile uint8_t *timer_interrupt_mask = cowpi_IObase + 0x4E;

uint32_t time = 0;

void setup() {
  cowpi_setup(0);
  mytimer1->control  = 0x00000500;  // Prescaler: 1024
  mytimer1->control |= 0x00000800;  // clear timer on compare match
  // interrupt (and clear counter) every 15,625 beats
  mytimer1->counter  = 0;
  mytimer1->compareA = 15624;       // the 15625th beat is when counter is 0
  timer_interrupt_mask[1] |= 0x02;
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
