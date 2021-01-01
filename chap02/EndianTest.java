/*
 * EndianTest.java (c) 2020-21 Christopher A. Bohn
 */

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.ObjectOutputStream;
import java.util.Arrays;
import java.util.stream.IntStream;

import static java.io.ObjectStreamConstants.TC_BLOCKDATA;

public class EndianTest {
    public static void main(String[] args) throws IOException {
        long sonde = 0x0123456789ABCDEFL;
        byte lsb = (byte)(sonde & 0xFF);
        ByteArrayOutputStream byteStream = new ByteArrayOutputStream();
        ObjectOutputStream objectStream = new ObjectOutputStream(byteStream);
        objectStream.writeLong(sonde);
        objectStream.flush();
        byte[] bytes = byteStream.toByteArray();
        byte[] effectivelyFinalBytes = bytes;       // variable in lambda expression must be final or effectively final
        int blockDataMarkerIndex = IntStream.range(0, bytes.length)
                .filter(i -> effectivelyFinalBytes[i] == TC_BLOCKDATA)
                .findFirst().orElse(-2);
        byte dataLength = bytes[blockDataMarkerIndex + 1];
        int rangeStart = blockDataMarkerIndex + 2;
        int rangeStop = rangeStart + dataLength;    // we are assuming (reasonably so) that the data is < 127 bytes
        bytes = Arrays.copyOfRange(bytes, rangeStart, rangeStop);
        System.out.println("Value 0x" + Long.toHexString(sonde) +
                "serialized and placed in " + byteStream.getClass().getSimpleName());
        for (int i = bytes.length - 1; i >= 0; i--) {
            System.out.println("\tbyte " + i + ": " + String.format("%02x", bytes[i]));
        }
        System.out.print("Based on the location of the least significant byte, Java is ");
        if (lsb == bytes[0]) {
            System.out.println("little endian.");
        } else if (lsb == bytes[bytes.length - 1]) {
            System.out.println("big endian.");      // we know this to be true
        } else {
            System.out.println("neither big- nor little endian, perhaps multibyte-swapped little endian.");
        }
    }
}
