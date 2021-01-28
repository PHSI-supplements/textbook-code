/*
 * inlining.c (c) 2018-20 Christopher A. Bohn
 */

int compute_triangle_number(int base) {
    int base_incremented = base + 1;
    int numerator = base * base_incremented;
    return numerator / 2;
}

int bonus_threshold() {
    int triangle_number = compute_triangle_number(6);
    return 3 * triangle_number;
}

int bonus_threshold_with_explicit_inlining() {
    // less maintainable
    int base_incremented = 6 + 1;
    int numerator = 6 * base_incremented;
    int triangle_number = numerator / 2;
    return 3 * triangle_number;
}

inline int compute_triangle_number_with_inline_hint(int base) {
    int base_incremented = base + 1;
    int numerator = base * base_incremented;
    return numerator / 2;
}

int bonus_threshold_with_compiler_generated_inlining() {
    // as maintainable as the version without inlining
    int triangle_number = compute_triangle_number_with_inline_hint(6);
    return 3 * triangle_number;
}
