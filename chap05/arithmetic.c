#pragma clang diagnostic push
#pragma clang diagnostic ignored "-Wunknown-pragmas"
#pragma ide diagnostic ignored "cppcoreguidelines-narrowing-conversions"
#pragma ide diagnostic ignored "OCUnusedGlobalDeclarationInspection"
#pragma ide diagnostic ignored "readability-non-const-parameter"
/*
 * arithmetic.c (c) 2018-20 Christopher A. Bohn
 */

long leaq_demo3(long i, long j) {
	return i+j;
}

long leaq_demo2(long i) {
	return 48*i;
}

long *leaq_demo1(long *i, long j) {
	return &i[j];
}

long add_demo(long *i, long j) {
	return *i + j;
}

long sub_demo(long *i, long j) {
	return *i - j;
}
 
long imul_demo(long *i, long j) {
	return *i * j;
}

long idiv_demo(long *i, long j) {
	return *i / j;
}

long iterate(long *i, long max) {
    long sum = 0;
    for (int j=0; j<max; j++) {
        sum += i[j];
    }
    return sum;
}

long shift(long i, long j) {
    return i+(j<<12);
}

long othershift(long i, long j) {
    return i+(j>>12);
}

long yetanothershift(long i, unsigned long j) {
    return i+(j>>12);
}

long shift_instruction(long i, long j) {
    return i >> j;
}

long subtract_from_immediate(long i) {
    return 438-i;
}

long shift_division(long i) {
    long j=i;
    return j/8;
}

long and_demo1(long i, long j) {
    return i & j;
}

long and_demo2(long i) {
    return 0x1F & i;
}

long and_demo3(long i, long j) {
    return i & (j << 4);
}

long not_demo(long i) {
    return ~i;
}

long shifted_not_demo1(long i) {
    return ~(i<<3);
}

long shifted_not_demo2(long i) {
    return (~i)<<3;
}



int main() {
	return 0;
}

#pragma clang diagnostic pop