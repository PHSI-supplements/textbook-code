/*
 * endian_test.c (c) 2018-20 Christopher A. Bohn
 */

#include <stdio.h>
#include <stdint.h>

int main() {
    uint64_t sonde = 0x0123456789ABCDEF;
    uint8_t lsb = sonde & 0xFF;
    uint8_t *bytes = (uint8_t *) (&sonde);
    printf("Value %#llx is at address %p\n", sonde, &sonde);
    for (int i = sizeof(sonde) - 1; i >= 0; i--) {
        printf("\t%p: %02x\n", bytes + i, bytes[i]);
    }
    printf("Based on the location of the least significant byte, your processor is ");
    if (lsb == bytes[0]) {
        printf("little endian.\n");
    } else if (lsb == bytes[sizeof(sonde) - 1]) {
        printf("big endian.\n");
    } else {
        printf("neither big- nor little endian, perhaps multibyte-swapped little endian.\n");
    }
    printf("Based on the pre-defined macros, your processor is ");
    int byte_order = __BYTE_ORDER__;
    switch (byte_order) {
        case __ORDER_LITTLE_ENDIAN__:
            printf("little endian.\n");
            break;
        case __ORDER_BIG_ENDIAN__:
            printf("big endian.\n");
            break;
        case __ORDER_PDP_ENDIAN__:
            printf("16bit-swapped little endian.\n");
            break;
        default:
            printf("neither big- nor little- nor pdp-endian.\n");
    }
}
