import React from 'react';
import { EventClustersView } from '../components/events/EventClustersView';
import { EventCluster } from '../types';

interface EventsPageProps {
  events: EventCluster[];
  onSelectEvent: (event: EventCluster) => void;
}

export const EventsPage: React.FC<EventsPageProps> = ({ events, onSelectEvent }) => {
  return (
    <div className="space-y-4">
      <EventClustersView events={events} onSelectEvent={onSelectEvent} />
    </div>
  );
};