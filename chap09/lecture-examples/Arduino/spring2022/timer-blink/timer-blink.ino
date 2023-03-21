#include "cowpi.h"

cowpi_ioPortRegisters *gpio = (cowpi_ioPortRegisters *)(cowpi_IObase + 3);
cowpi_timerRegisters8bit *mytimer0 = (cowpi_timerRegisters8bit *)(cowpi_IObase + 0x24);
cowpi_timerRegisters8bit *mytimer2 = (cowpi_timerRegisters8bit *)(cowpi_IObase + 0x90);

uint32_t time = 0, mytime = 0;
uint8_t now = 0, then = 0;

void setup() {
  cowpi_setup(0);
  mytimer2->control |= 0x0003;    // Mode: Fast PWM
  mytimer2->control |= 0x0400;    // Prescaler: 64 -- pay attention!
  Serial.begin(9600);
}

void loop() {   // shh... the LEDs don't actually stay in sync
  time = millis();
  then = now;
  now = mytimer2->counter;
  if (now < then) // overflow?
    mytime++;
  // if ((time & 0x0400) || (mytime & 0x400)) {Serial.print("  time: "); Serial.print(time); Serial.print("\tmytime: "); Serial.println(mytime);}
  if (time & 0x0400)
    gpio[D8_D13].output |= 0x20;
  else
    gpio[D8_D13].output &= ~(0x20);
  if (mytime & 0x0400)
    gpio[D8_D13].output |= 0x10;
  else
    gpio[D8_D13].output &= ~(0x10);
}
