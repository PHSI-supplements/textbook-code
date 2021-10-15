#include "Arduino.h"

#define D8_D13  0                 // PINB/DDRB/PORTB / PCMSK0
#define A0_A5   1                 // PINC/DDRC/PORTC / PCMSK1
#define D0_D7   2                 // PIND/DDRD/PORTD / PCMSK2

uint8_t * const IObase = (uint8_t *)0x20;

/* EXTERNAL PINS
 * Pins `D8_D13` `A0_A5` `D0_D7` struct gpio_registers[] at IObase + 0x03 (0x23)
 * * D8..D13 at IObase + 0x03 (0x23)
 * * A0..A5  at IObase + 0x06 (0x26)
 * * D0..D7  at IObase + 0x09 (0x29)
 *
 *
 * PIN-BASED INTERRUPTS
 * struct pin_interrupt_registers      at IObase + 0x1B (0x3B)
 *
 *
 * PROTOCOLS
 * SPI           struct spi_registers  at IObase + 0x2C (0x4C)
 * I2C (aka TWI) struct i2c_registers  at IObase + 0x98 (0xB8)
 *
 *
 * TIMER/COUNTERS
 * Timer0 struct timer_registers_8bit  at IObase + 0x24 (0x44)
 * Timer1 struct timer_registers_16bit at IObase + 0x60 (0x80)
 * Timer2 struct timer_registers_8bit  at IObase + 0x90 (0xB0)
 *
 * Timer `0` `1` `2` Interrupt Mask Register uint8_t[] at IObase + 0x4E (0x6E)
 * * TIMSKx
 * * 0 at (0x6E)
 * * 1 at (0x6F)
 * * 2 at (0x70)
 * Timer `0` `1` `2` Interrupt Flag Register uint8_t[] at IObase + 0x15 (0x35)
 * * TIFRx
 * * 0 at (0x35)
 * * 1 at (0x36)
 * * 2 at (0x37)
 *
 * General Timer/Counter Control Register (Timer0 & Timer1) uint8_t at IObase + 0x23 (0x4C)
 * * GTCCR
 * Asynchronous Status Register (Timer2 only)               uint8_t at IObase + 0x96 (0xB6)
 * * ASSR
 */

struct gpio_registers {
  volatile uint8_t input;                   // PINx
  volatile uint8_t direction;               // DDRx
  volatile uint8_t output;                  // PORTx
};

struct spi_registers {
  volatile uint8_t control;                 // SPCR
  volatile uint8_t status;                  // SPSR
  volatile uint8_t data;                    // SPDR
};

struct i2c_registers {
  volatile uint8_t bit_rate;                // TWBR
  volatile uint8_t status;                  // TWSR
  volatile uint8_t address;                 // TWAR
  volatile uint8_t data;                    // TWBB
  volatile uint8_t control;                 // TWCR
  volatile uint8_t peripheral_address_mask; // TWAMR
};

struct pin_interrupt_registers {
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
};

struct timer_registers_8bit {
  volatile uint16_t control;                // TCCRxB TCCRxA
  volatile uint8_t  counter;                // TCNTx
  volatile uint8_t  compareA;               // OCRxA
  volatile uint8_t  compareB;               // OCRxB
};

struct timer_registers_16bit {
  volatile uint32_t control;                // Reserved TCCRxC TCCRxB TCCRxA
  volatile uint16_t counter;                // TCNTxH TCNTxL
  volatile uint16_t capture;                // ICRxH ICRxL
  volatile uint16_t compareA;               // OCRxAH OCRxAL
  volatile uint16_t compareB;               // OCRxBH OCRxBL
};
