/*
 * CowPi (c) 2021-22 Christopher A. Bohn
 */

/******************************************************************************
 * This header provides the base address for memory-mapped I/O and
 * data structures to conveniently access the I/O registers.
 ******************************************************************************/

#ifndef COWPI_H
#define COWPI_H

#include "Arduino.h"


#if defined ARDUINO_AVR_UNO || defined ARDUINO_AVR_NANO
uint8_t * const cowpi_IObase = (uint8_t *)0x20;

#define cowpi_spiEnable do {                            \
    /* Enable SPI, Controller, set clock rate fck/16 */ \
    SPCR = (1 << SPE) | (1 << MSTR) | (1 << SPR0);      \
} while(0);

#define cowpi_spiDisable do {                           \
    SPCR = 0;                                           \
} while(0);

#elif defined ARDUINO_AVR_NANO_EVERY
uint8_t * const cowpi_IObase = (uint8_t *)0x0;
#error Arduino Nano Every is not yet supported for CowPi
#elif defined ARDUINO_ARDUINO_NANO33BLE
#error Arduino Nano 33 BLE is not yet supported for CowPi
#elif defined ARDUINO_SAMD_NANO_33_IOT
#error Arduino Nano 33 IOT is not yet supported for CowPi
#elif defined ARDUINO_NANO_RP2040_CONNECT
#error Arduino Nano RP2040 is not yet supported for CowPi
#elif defined ARDUINO_AVR_MEGA2560
#error Arduino Mega 2560 is not yet supported for CowPi
#elif defined ARDUINO_RASPBERRY_PI_PICO
#error Raspberry Pi Pico Arduino core is not yet supported for CowPi
#else
#error Your microcontroller board is not supported for CowPi.
#endif //MICROCONTROLLER BOARD




#define SPI                     0x01
#define I2C                     0x02
#define MAX7219                 0x80


#define cowpi_setup(options) do {                       \
  /* Simple I/O */                                      \
  pinMode(A4, INPUT_PULLUP);                            \
  pinMode(A5, INPUT_PULLUP);                            \
  pinMode( 8, INPUT_PULLUP);                            \
  pinMode( 9, INPUT_PULLUP);                            \
  pinMode(10, INPUT_PULLUP);                            \
  pinMode(11, INPUT_PULLUP);                            \
  pinMode(12, OUTPUT);                                  \
  pinMode(13, OUTPUT);                                  \
  /* Keypad */                                          \
  pinMode( 4, OUTPUT);                                  \
  pinMode( 5, OUTPUT);                                  \
  pinMode( 6, OUTPUT);                                  \
  pinMode( 7, OUTPUT);                                  \
  pinMode(A0, INPUT_PULLUP);                            \
  pinMode(A1, INPUT_PULLUP);                            \
  pinMode(A2, INPUT_PULLUP);                            \
  pinMode(A3, INPUT_PULLUP);                            \
  digitalWrite(4, LOW);                                 \
  digitalWrite(5, LOW);                                 \
  digitalWrite(6, LOW);                                 \
  digitalWrite(7, LOW);                                 \
  /* Display Module */                                  \
  if((options) & SPI) {                                 \
    pinMode(10, OUTPUT);                                \
    pinMode(11, OUTPUT);                                \
  }                                                     \
  if((options) & I2C) {                                 \
    pinMode(A4, OUTPUT);                                \
    pinMode(A5, OUTPUT);                                \
  }                                                     \
  if((options) & MAX7219) {                             \
    /* Clear all digit registers */                     \
    for(int i = 1; i <= 8; i++) {                       \
      digitalWrite(10, LOW);                            \
      shiftOut(11, 13, MSBFIRST, i);                    \
      shiftOut(11, 13, MSBFIRST, 0);                    \
      digitalWrite(10, HIGH);                           \
    }                                                   \
    /* Take display out of decode mode */               \
    digitalWrite(10, LOW);                              \
    shiftOut(11, 13, MSBFIRST, 0x9);                    \
    shiftOut(11, 13, MSBFIRST, 0);                      \
    digitalWrite(10, HIGH);                             \
    /* Intensity at 7/32 */                             \
    digitalWrite(10, LOW);                              \
    shiftOut(11, 13, MSBFIRST, 0xA);                    \
    shiftOut(11, 13, MSBFIRST, 3);                      \
    digitalWrite(10, HIGH);                             \
    /* Scan all eight digits */                         \
    digitalWrite(10, LOW);                              \
    shiftOut(11, 13, MSBFIRST, 0xB);                    \
    shiftOut(11, 13, MSBFIRST, 7);                      \
    digitalWrite(10, HIGH);                             \
    /* Take display out of shutdown mode */             \
    digitalWrite(10, LOW);                              \
    shiftOut(11, 13, MSBFIRST, 0xC);                    \
    shiftOut(11, 13, MSBFIRST, 1);                      \
    digitalWrite(10, HIGH);                             \
    /* Take display out of test mode */                 \
    digitalWrite(10, LOW);                              \
    shiftOut(11, 13, MSBFIRST, 0xF);                    \
    shiftOut(11, 13, MSBFIRST, 0);                      \
    digitalWrite(10, HIGH);                             \
    /* Enabling SPI must happen later */                \
    /* Enabling SPI sets pin D12 to input */            \
  }                                                     \
} while(0)




/* =================================
 * ARDUINO NANO and UNO (ATMega328P)
 * =================================
 *
 *
 * EXTERNAL PINS
 * Pins `D8_D13` `A0_A5` `D0_D7` cowpi_ioPortRegisters[] at cowpi_IObase + 0x03 (0x23)
 * * D8..D13 at cowpi_IObase + 0x03 (0x23)
 * * A0..A5  at cowpi_IObase + 0x06 (0x26)
 * * D0..D7  at cowpi_IObase + 0x09 (0x29)
 *
 *
 * PIN-BASED INTERRUPTS
 * cowpi_pinInterruptRegisters      at cowpi_IObase + 0x1B (0x3B)
 *
 *
 * PROTOCOLS
 * SPI           cowpi_spiRegisters at cowpi_IObase + 0x2C (0x4C)
 * I2C (aka TWI) cowpi_i2cRegisters at cowpi_IObase + 0x98 (0xB8)
 *
 *
 * TIMER/COUNTERS
 * Timer0 cowpi_timerRegisters8bit  at cowpi_IObase + 0x24 (0x44)
 * Timer1 cowpi_timerRegisters16bit at cowpi_IObase + 0x60 (0x80)
 * Timer2 cowpi_timerRegisters8bit  at cowpi_IObase + 0x90 (0xB0)
 *
 * Timer `0` `1` `2` Interrupt Mask Register uint8_t[] at cowpi_IObase + 0x4E (0x6E)
 * * TIMSKx
 * * 0 at (0x6E)
 * * 1 at (0x6F)
 * * 2 at (0x70)
 * Timer `0` `1` `2` Interrupt Flag Register uint8_t[] at cowpi_IObase + 0x15 (0x35)
 * * TIFRx
 * * 0 at (0x35)
 * * 1 at (0x36)
 * * 2 at (0x37)
 *
 * General Timer/Counter Control Register (Timer0 & Timer1) uint8_t at cowpi_IObase + 0x23 (0x4C)
 * * GTCCR
 * Asynchronous Status Register (Timer2 only)               uint8_t at cowpi_IObase + 0x96 (0xB6)
 * * ASSR
 */

#if defined ARDUINO_AVR_UNO || defined ARDUINO_AVR_NANO

#define D8_D13  0                 // PINB/DDRB/PORTB / PCMSK0
#define A0_A5   1                 // PINC/DDRC/PORTC / PCMSK1
#define D0_D7   2                 // PIND/DDRD/PORTD / PCMSK2

typedef struct {
  volatile uint8_t input;                   // PINx
  volatile uint8_t direction;               // DDRx
  volatile uint8_t output;                  // PORTx
} cowpi_ioPortRegisters;

typedef struct {
  volatile uint8_t control;                 // SPCR
  volatile uint8_t status;                  // SPSR
  volatile uint8_t data;                    // SPDR
} cowpi_spiRegisters;

typedef struct {
  volatile uint8_t bit_rate;                // TWBR
  volatile uint8_t status;                  // TWSR
  volatile uint8_t address;                 // TWAR
  volatile uint8_t data;                    // TWBB
  volatile uint8_t control;                 // TWCR
  volatile uint8_t peripheral_address_mask; // TWAMR
} cowpi_i2cRegisters;

typedef struct {
  // pci = pin change interrupt
  // ei  = external interrupt
  volatile uint8_t pci_flags;               // PCIFR
  volatile uint8_t ei_flags;                // EIFR
  volatile uint8_t ei_mask;                 // EIMSK
  volatile uint8_t __DO_NOT_TOUCH_1__[0x2A];// padding
  volatile uint8_t pci_control;             // PCICR
  volatile uint8_t ei_control;              // EICRA
  volatile uint8_t __DO_NOT_TOUCH_2__;      // padding
  volatile uint8_t pci_mask[3];             // PCMSKx
                  // * D8..D13 at (0x6B)
                  // * A0..A5  at (0x6C)
                  // * D0..D7  at (0x6D)
} cowpi_pinInterruptRegisters;

typedef struct {
  volatile uint16_t control;                // TCCRxB TCCRxA
  volatile uint8_t  counter;                // TCNTx
  volatile uint8_t  compareA;               // OCRxA
  volatile uint8_t  compareB;               // OCRxB
} cowpi_timerRegisters8bit;

typedef struct {
  volatile uint32_t control;                // Reserved TCCRxC TCCRxB TCCRxA
  volatile uint16_t counter;                // TCNTxH TCNTxL
  volatile uint16_t capture;                // ICRxH ICRxL
  volatile uint16_t compareA;               // OCRxAH OCRxAL
  volatile uint16_t compareB;               // OCRxBH OCRxBL
} cowpi_timerRegisters16bit;

#endif //NANO

#endif //COWPI_H
