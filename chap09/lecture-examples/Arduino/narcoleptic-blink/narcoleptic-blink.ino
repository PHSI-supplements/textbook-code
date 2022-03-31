#include <avr/sleep.h>
#include "cowpi.h"

void go_to_sleep();
void waken();

volatile uint8_t *timer_interrupt_mask = cowpi_IObase + 0x4E;

uint32_t time;
char count = 0;
bool cycled = true;

void setup() {
  Serial.begin(9600);
  cowpi_setup(0);
}

void loop() {
  time = millis();
  if (time & 0x100) {
    digitalWrite(12, HIGH);
    digitalWrite(13, LOW);
    if (cycled) {
      cycled = false;
      count++;
    }
  } else {
    digitalWrite(12, LOW);
    digitalWrite(13, HIGH);
    cycled = true;
  }
  if (count == 10) {
    count = 0;
    go_to_sleep();
  }
}

void go_to_sleep() {
  Serial.print("sleep");
  digitalWrite(12, LOW);            // Even in "PWR_DOWN", LED stays lit, so we'll turn it off
  delay(50);                        // Wait for LED to turn off
  timer_interrupt_mask[0] &= 0xFE;  // Timer0 interrupt wakes CPU from IDLE, so we'll disable it
  sleep_enable();
  set_sleep_mode(SLEEP_MODE_IDLE);
  attachInterrupt(digitalPinToInterrupt(2), waken, FALLING);
  sleep_cpu();
}

void waken() {
  detachInterrupt(digitalPinToInterrupt(2));
  sleep_disable();
  timer_interrupt_mask[0] |= 0x01;  // Re-enable Timer0 overflow interrupt
  digitalWrite(12, HIGH);           // Turn LED back on
  Serial.println("\tawake");
}
