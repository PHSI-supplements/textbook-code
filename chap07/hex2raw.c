/*
 * hex2raw.c (c) 2021 Christopher A. Bohn
 */

#include <ctype.h>
#include <stdint.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

/*
void simple_hex2raw() {
    int hex;
    int scan_return;
    while (((scan_return = scanf("%x", &hex)) != EOF) && (scan_return != 0)) { // NOLINT(cert-err34-c)
        if (hex & ~0xFF) {
            fprintf(stderr, "Warning: 0x%x requires more than one byte; truncating to 0x%x.\n", hex, (hex & 0xFF));
        }
        printf("%c", hex);
    }
}
*/

enum state {
    READING_FIRST_HEX, READING_SECOND_HEX, CONVERTING, POSSIBLE_COMMENT, INLINE_COMMENT, BLOCK_COMMENT
};

void hex2raw() {
    enum state mode = READING_FIRST_HEX;
    char hex_string[3] = "\0\0\0";
    uint8_t hex_byte;
    char scanned_character;
    int scan_return = scanf("%c", &scanned_character);
    while ((scan_return != EOF) && (scan_return != 0)) {
        switch (mode) {
            case READING_FIRST_HEX:
                if (isxdigit(scanned_character)) {
                    hex_string[0] = scanned_character;
                    mode = READING_SECOND_HEX;
                } else if (isspace(scanned_character)) {
                    // consume and ignore whitespace;
                    mode = READING_FIRST_HEX;
                } else if (scanned_character == '/') {
                    hex_string[0] = scanned_character;
                    mode = POSSIBLE_COMMENT;
                } else if (scanned_character == '#') {
                    mode = INLINE_COMMENT;
                } else {
                    fprintf(stderr, "Ignoring '%c'\n", scanned_character);
                    mode = READING_FIRST_HEX;
                }
                break;
            case READING_SECOND_HEX:
                if (isxdigit(scanned_character) || (scanned_character == '/') || (scanned_character == '#')) {
                    hex_string[1] = scanned_character;
                    mode = CONVERTING;
                } else if (isspace(scanned_character)) {
                    hex_string[1] = '\0';
                    mode = CONVERTING;
                } else {
                    fprintf(stderr, "Ignoring '%c'\n", scanned_character);
                    mode = CONVERTING;
                }
                break;
            case CONVERTING:
                hex_byte = strtol(hex_string, NULL, 16) & 0xFF;
                printf("%c", hex_byte);
                if (hex_string[1] == '/') {
                    hex_string[0] = hex_string[1];
                    hex_string[1] = '\0';
                    mode = POSSIBLE_COMMENT;
                } else if (hex_string[1] == '#') {
                    hex_string[0] = hex_string[1] = '\0';
                    mode = INLINE_COMMENT;
                } else {
                    hex_string[0] = hex_string[1] = '\0';
                    mode = READING_FIRST_HEX;
                }
                break;
            case POSSIBLE_COMMENT:
                if (scanned_character == '/') {
                    hex_string[0] = '\0';
                    mode = INLINE_COMMENT;
                } else if (scanned_character == '*') {
                    hex_string[0] = '\0';
                    mode = BLOCK_COMMENT;
                } else {
                    fprintf(stderr, "Ignoring '%c'\n", hex_string[0]);
                    // TODO: process scanned character as first hex
                    hex_string[0] = '\0';
                    mode = READING_FIRST_HEX; // TODO: READING_SECOND_HEX
                }
                break;
            case INLINE_COMMENT:
                // ignore everything, except...
                if (scanned_character == '\n') {
                    mode = READING_FIRST_HEX;
                }
                break;
            case BLOCK_COMMENT:
                hex_string[0] = hex_string[1];
                hex_string[1] = scanned_character;
                if (!strcmp(hex_string, "*/")) {
                    hex_string[0] = hex_string[1] = '\0';
                    mode = READING_FIRST_HEX;
                }
                break;
            default:
                fprintf(stderr, "Reached unreachable code with mode==%d!\n", mode);
        }
        if (mode != CONVERTING) {
            scan_return = scanf("%c", &scanned_character);
        }
    }
    if (hex_string[0]) {
        // one last conversion
        hex_byte = strtol(hex_string, NULL, 16) & 0xFF;
        printf("%c", hex_byte);
    }
}

int main() {
    hex2raw();
    return 0;
}
