import { createContext, useContext, useState, ReactNode } from 'react';

interface Event {
  id: number;
  name: string;
  date: string;
  time: string;
  location: string;
  description: string;
  price: string;
  maxSupply: number;
  maxResalePrice: string;
  available: number;
  image: string;
  creator: string | null;
  category: 'conference' | 'concert' | 'sports';
  gateAddress?: string;
}

interface Ticket {
  id: string;
  eventId: number;
  isResaleActive: boolean;
  isVerified?: boolean;
}

interface EventsContextType {
  events: Event[];
  tickets: Ticket[];
  addEvent: (event: Omit<Event, 'id' | 'available' | 'creator'>) => void;
  getEventById: (id: number) => Event | undefined;
  getHostedEvents: (address: string | null) => Event[];
  toggleResale: (ticketId: string) => void;
  isResaleActive: (ticketId: string) => boolean;
  verifyTicket: (ticketId: string) => void;
  isTicketVerified: (ticketId: string) => boolean;
}

const EventsContext = createContext<EventsContextType>({
  events: [],
  tickets: [],
  addEvent: () => {},
  getEventById: () => undefined,
  getHostedEvents: () => [],
  toggleResale: () => {},
  isResaleActive: () => false,
  verifyTicket: () => {},
  isTicketVerified: () => false,
});

export function EventsProvider({ children }: { children: ReactNode }) {
  const [events, setEvents] = useState<Event[]>([
    {
      id: 1,
      name: "ETH Global London 2025",
      date: "2025-03-15",
      time: "09:00",
      location: "London, UK",
      price: "0.1",
      maxResalePrice: "0.15",
      available: 150,
      maxSupply: 500,
      description: "Join us for the biggest Ethereum event in London! Connect with developers, entrepreneurs, and enthusiasts from around the world. Experience three days of intensive learning, building, and networking.",
      image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=1000",
      creator: "0x1234...5678",
      category: "conference",
      gateAddress: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e"
    },
    {
      id: 2,
      name: "Coldplay: Music Of The Spheres World Tour",
      date: "2025-04-20",
      time: "19:30",
      location: "Wembley Stadium, London",
      price: "0.2",
      maxResalePrice: "0.3",
      available: 1000,
      maxSupply: 5000,
      description: "Experience Coldplay's groundbreaking Music Of The Spheres World Tour, featuring spectacular visuals, immersive technology, and all their greatest hits in an unforgettable eco-friendly show.",
      image: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?auto=format&fit=crop&q=80&w=1000",
      creator: "0x9876...4321",
      category: "concert",
      gateAddress: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e"
    },
    {
      id: 3,
      name: "Cigarettes After Sex: World Tour 2025",
      date: "2025-05-15",
      time: "20:00",
      location: "Royal Albert Hall, London",
      price: "0.15",
      maxResalePrice: "0.25",
      available: 800,
      maxSupply: 2000,
      description: "Experience the dreamy, atmospheric sound of Cigarettes After Sex in the stunning Royal Albert Hall. An evening of ethereal pop and ambient rock that will transport you to another world.",
      image: "https://images.unsplash.com/photo-1501612780327-45045538702b?auto=format&fit=crop&q=80&w=1000",
      creator: "0xabcd...efgh",
      category: "concert",
      gateAddress: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e"
    },
    {
      id: 4,
      name: "Mood Indigo: Live in Concert",
      date: "2025-06-10",
      time: "20:30",
      location: "Barbican Centre, London",
      price: "0.12",
      maxResalePrice: "0.18",
      available: 400,
      maxSupply: 1000,
      description: "Join us for an evening of jazz-infused indie rock with Mood Indigo. Experience their unique blend of genres in the world-class acoustics of the Barbican Centre.",
      image: "https://images.unsplash.com/photo-1511735111819-9a3f7709049c?auto=format&fit=crop&q=80&w=1000",
      creator: "0xijkl...mnop",
      category: "concert",
      gateAddress: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e"
    },
    {
      id: 5,
      name: "Diljit Dosanjh: Crossover World Tour",
      date: "2025-07-01",
      time: "19:00",
      location: "The O2, London",
      price: "0.18",
      maxResalePrice: "0.28",
      available: 5000,
      maxSupply: 20000,
      description: "Global Punjabi superstar Diljit Dosanjh brings his electrifying Crossover World Tour to London. Experience a fusion of Punjabi folk, hip-hop, and pop in this high-energy spectacular.",
      image: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?auto=format&fit=crop&q=80&w=1000",
      creator: "0xqrst...uvwx",
      category: "concert",
      gateAddress: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e"
    },
    {
      id: 6,
      name: "UEFA Champions League Final 2025",
      date: "2025-05-31",
      time: "20:45",
      location: "Allianz Arena, Munich",
      price: "0.5",
      maxResalePrice: "0.75",
      available: 500,
      maxSupply: 2000,
      description: "Experience the pinnacle of European club football as the continent's top teams battle for glory in the UEFA Champions League Final.",
      image: "https://images.unsplash.com/photo-1522778119026-d647f0596c20?auto=format&fit=crop&q=80&w=1000",
      creator: "0xabcd...efgh",
      category: "sports",
      gateAddress: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e"
    },
    {
      id: 7,
      name: "East Bengal vs Mohun Bagan: Kolkata Derby",
      date: "2025-07-20",
      time: "19:30",
      location: "Salt Lake Stadium, Kolkata",
      price: "0.08",
      maxResalePrice: "0.12",
      available: 20000,
      maxSupply: 85000,
      description: "Witness one of football's most passionate derbies as East Bengal takes on Mohun Bagan in the legendary Kolkata Derby. Experience over 100 years of rivalry in India's football capital.",
      image: "https://images.unsplash.com/photo-1489944440615-453fc2b6a9a9?auto=format&fit=crop&q=80&w=1000",
      creator: "0xqrst...uvwx",
      category: "sports",
      gateAddress: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e"
    }
  ]);

  const [tickets, setTickets] = useState<Ticket[]>([
    { id: "T-001", eventId: 1, isResaleActive: false, isVerified: false },
    { id: "T-002", eventId: 1, isResaleActive: false, isVerified: false },
    { id: "T-003", eventId: 2, isResaleActive: false, isVerified: false },
    { id: "T-004", eventId: 3, isResaleActive: false, isVerified: false },
    { id: "T-005", eventId: 4, isResaleActive: false, isVerified: false },
    { id: "T-006", eventId: 5, isResaleActive: false, isVerified: false },
  ]);

  const addEvent = (newEvent: Omit<Event, 'id' | 'available' | 'creator'>) => {
    setEvents(prevEvents => [
      ...prevEvents,
      {
        ...newEvent,
        id: prevEvents.length + 1,
        available: Number(newEvent.maxSupply),
        creator: window.ethereum?.selectedAddress || null
      }
    ]);
  };

  const getEventById = (id: number) => {
    return events.find(event => event.id === id);
  };

  const getHostedEvents = (address: string | null) => {
    if (!address) return [];
    return events.filter(event => event.creator === address);
  };

  const toggleResale = (ticketId: string) => {
    setTickets(prevTickets =>
      prevTickets.map(ticket =>
        ticket.id === ticketId
          ? { ...ticket, isResaleActive: !ticket.isResaleActive }
          : ticket
      )
    );
  };

  const isResaleActive = (ticketId: string) => {
    return tickets.find(ticket => ticket.id === ticketId)?.isResaleActive || false;
  };

  const verifyTicket = (ticketId: string) => {
    setTickets(prevTickets =>
      prevTickets.map(ticket =>
        ticket.id === ticketId
          ? { ...ticket, isVerified: true }
          : ticket
      )
    );
  };

  const isTicketVerified = (ticketId: string) => {
    return tickets.find(ticket => ticket.id === ticketId)?.isVerified || false;
  };

  return (
    <EventsContext.Provider value={{ 
      events, 
      tickets, 
      addEvent, 
      getEventById, 
      getHostedEvents, 
      toggleResale,
      isResaleActive,
      verifyTicket,
      isTicketVerified
    }}>
      {children}
    </EventsContext.Provider>
  );
}

export const useEvents = () => useContext(EventsContext);