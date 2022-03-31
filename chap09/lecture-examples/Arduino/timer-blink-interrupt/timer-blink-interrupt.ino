#include "cowpi.h"

cowpi_ioPortRegisters *gpio = (cowpi_ioPortRegisters *)(cowpi_IObase + 3);
cowpi_timerRegisters8bit *mytimer0 = (cowpi_timerRegisters8bit *)(cowpi_IObase + 0x24);
cowpi_timerRegisters8bit *mytimer2 = (cowpi_timerRegisters8bit *)(cowpi_IObase + 0x90);
volatile uint8_t *timer_interrupt_mask = cowpi_IObase + 0x4E;

uint32_t time = 0;
volatile uint32_t mytime = 0;

void setup() {
  cowpi_setup(0);
  timer_interrupt_mask[0] |= 0x02;  // enable "compare match A" interrupt
  mytimer0->compareA = 0x80;     	  // compare to 0x80 (halfway between overflows)
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
