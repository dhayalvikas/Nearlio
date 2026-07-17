package com.nearlio.service;

import org.springframework.stereotype.Service;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.io.IOException;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class SseEmitterService {

    // One emitter per logged-in user's open connection.
    // ConcurrentHashMap because multiple HTTP threads can add/remove/send concurrently.
    private final Map<String, SseEmitter> emitters = new ConcurrentHashMap<>();

    public SseEmitter subscribe(String userEmail) {
        SseEmitter emitter = new SseEmitter(0L); // 0 = no timeout, stays open until client disconnects

        emitters.put(userEmail, emitter);

        emitter.onCompletion(() -> emitters.remove(userEmail));
        emitter.onTimeout(() -> emitters.remove(userEmail));
        emitter.onError((e) -> emitters.remove(userEmail));

        return emitter;
    }

    public void sendBookingUpdate(String userEmail, Object payload) {
        SseEmitter emitter = emitters.get(userEmail);
        if (emitter == null) return; // user isn't connected right now — that's fine, not an error

        try {
            emitter.send(SseEmitter.event()
                    .name("booking-update")
                    .data(payload));
        } catch (IOException e) {
            emitters.remove(userEmail);
        }
    }
}