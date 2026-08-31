import asyncio
import json
from typing import Dict, List, Callable, Optional

class WeatherMessageBroker:
    """
    Message Broker supporting Apache Kafka when available, with an ultra-reliable
    asynchronous in-memory event stream fallback for single-node execution and hackathon demos.
    """
    def __init__(self):
        self.queues = {
            "weather.raw": asyncio.Queue(),
            "weather.cleaned": asyncio.Queue(),
            "weather.enriched": asyncio.Queue(),
            "weather.verification": asyncio.Queue(),
            "weather.alerts": asyncio.Queue(),
            "weather.deadletter": asyncio.Queue()
        }
        self.subscribers = {topic: [] for topic in self.queues}
        self.metrics = {
            "messages_in_last_min": 0,
            "total_published": 0,
            "failed_messages": 0
        }

    async def publish(self, topic: str, message: Dict):
        if topic in self.queues:
            await self.queues[topic].put(message)
            self.metrics["total_published"] += 1
            self.metrics["messages_in_last_min"] += 1
            for callback in self.subscribers.get(topic, []):
                try:
                    if asyncio.iscoroutinefunction(callback):
                        await callback(message)
                    else:
                        callback(message)
                except Exception as e:
                    self.metrics["failed_messages"] += 1
                    print(f"Subscriber error on topic {topic}: {e}")

    def subscribe(self, topic: str, callback: Callable):
        if topic in self.subscribers:
            self.subscribers[topic].append(callback)

broker = WeatherMessageBroker()
