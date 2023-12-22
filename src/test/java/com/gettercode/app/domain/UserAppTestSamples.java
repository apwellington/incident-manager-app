package com.gettercode.app.domain;

import java.util.Random;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicLong;

public class UserAppTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    public static UserApp getUserAppSample1() {
        return new UserApp().id(1L).phone("phone1");
    }

    public static UserApp getUserAppSample2() {
        return new UserApp().id(2L).phone("phone2");
    }

    public static UserApp getUserAppRandomSampleGenerator() {
        return new UserApp().id(longCount.incrementAndGet()).phone(UUID.randomUUID().toString());
    }
}
