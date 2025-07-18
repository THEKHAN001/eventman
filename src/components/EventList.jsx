import React from 'react';
import EventCard from './EventCard';
import Button from './Button';
import './css/EventList.css';
import eventsData from '../data/eventsData';

const EventList = () => {
  const [events, setEvents] = React.useState([]);
  const [page, setPage] = React.useState(1);
  const [hasMore, setHasMore] = React.useState(true);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);
  const [filter, setFilter] = React.useState('all');

  const fetchEvents = async (pageNum) => {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:3001/api/events/upcoming?page=${pageNum}&limit=6`);
      if (!response.ok) throw new Error('Failed to fetch events');
      const data = await response.json();
      setEvents(prev => [...prev, ...data.events]);
      setHasMore(data.hasMore);
      setPage(pageNum);
    } catch (err) {
      console.error('Falling back to mock data:', err);
      const startIndex = 0;
      const endIndex = pageNum * 6;
      setEvents(eventsData.slice(startIndex, endIndex));
      setHasMore(endIndex < eventsData.length);
      setError(null);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchEvents(1);
  }, []);

  return (
    <div className="event-list">
      <div className="event-list-header">
        <h1 className="event-list-title">Discover Upcoming Events</h1>
        <p className="event-list-subtitle">Find experiences that match your interests</p>
        
        <div className="event-filters">
          <button 
            className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All Events
          </button>
          <button 
            className={`filter-btn ${filter === 'today' ? 'active' : ''}`}
            onClick={() => setFilter('today')}
          >
            Today
          </button>
          <button 
            className={`filter-btn ${filter === 'week' ? 'active' : ''}`}
            onClick={() => setFilter('week')}
          >
            This Week
          </button>
          <button 
            className={`filter-btn ${filter === 'month' ? 'active' : ''}`}
            onClick={() => setFilter('month')}
          >
            This Month
          </button>
        </div>
      </div>

      <div className="event-grid">
        {events.map(event => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>

      {loading && (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Finding amazing events...</p>
        </div>
      )}

      {hasMore && !loading && (
        <div className="load-more">
          <Button 
            onClick={() => fetchEvents(page + 1)} 
            variant="outline"
            className="load-more-btn"
          >
            Show More Events
            <i className="fas fa-arrow-down"></i>
          </Button>
        </div>
      )}

      {!hasMore && (
        <div className="no-more-events">
          <div className="divider-line"></div>
          <p>You've reached the end! Check back later for more events.</p>
        </div>
      )}

      {error && (
        <div className="error-message">
          <i className="fas fa-exclamation-triangle"></i>
          <p>{error.message || 'Failed to load events'}</p>
          <Button onClick={() => fetchEvents(1)}>Try Again</Button>
        </div>
      )}
    </div>
  );
};

export default EventList;