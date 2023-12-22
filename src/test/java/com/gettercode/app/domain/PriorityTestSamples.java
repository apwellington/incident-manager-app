package com.gettercode.app.domain;

import java.util.Random;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.concurrent.atomic.AtomicLong;

public class PriorityTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));
    private static final AtomicInteger intCount = new AtomicInteger(random.nextInt() + (2 * Short.MAX_VALUE));

    public static Priority getPrioritySample1() {
        return new Priority().id(1L).name("name1").level(1);
    }

    public static Priority getPrioritySample2() {
        return new Priority().id(2L).name("name2").level(2);
    }

    public static Priority getPriorityRandomSampleGenerator() {
        return new Priority().id(longCount.incrementAndGet()).name(UUID.randomUUID().toString()).level(intCount.incrementAndGet());
    }
}
