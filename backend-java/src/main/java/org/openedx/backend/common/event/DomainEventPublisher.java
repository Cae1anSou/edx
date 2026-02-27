package org.openedx.backend.common.event;

public interface DomainEventPublisher {

    void publish(Object event);
}
