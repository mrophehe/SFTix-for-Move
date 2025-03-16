module TicketingSFT {
    use std::signer;
    use aptos_framework::coin::{Self, Coin};
    use aptos_framework::event::{Event};
    use aptos_framework::vector::{self};

    /// Resource defining an event
    struct EventResource has key, store {
        name: vector<u8>,
        max_supply: u64,
        price: u64,
        max_resale_price: u64,
        resale_allowed: bool,
        is_active: bool,
        entry_gate: option<address>,
        sold_tickets: u64,
    }
    
    /// Resource for tracking ticket ownership
    struct Ticket has key, store {
        event_id: u64,
        owner: address,
    }
    
    /// Resource to store all events
    struct TicketingStore has key, store {
        events: table<u64, EventResource>,
        next_event_id: u64,
    }
    
    /// Initialize the ticketing system
    public fun init(admin: &signer) {
        let store = TicketingStore { events: table::new<u64, EventResource>(), next_event_id: 0 };
        move_to(admin, store);
    }
    
    /// Create a new event
    public fun create_event(
        admin: &signer, name: vector<u8>, max_supply: u64, price: u64, max_resale_price: u64
    ): u64 {
        let store = borrow_global_mut<TicketingStore>(signer::address_of(admin));
        let event_id = store.next_event_id;
        table::add(&mut store.events, event_id, EventResource {
            name, max_supply, price, max_resale_price,
            resale_allowed: false, is_active: true, entry_gate: none, sold_tickets: 0
        });
        store.next_event_id = event_id + 1;
        event_id
    }
    
    /// Purchase a ticket
    public fun purchase_ticket(buyer: &signer, event_id: u64) {
        let store = borrow_global_mut<TicketingStore>(signer::address_of(buyer));
        let event = table::borrow_mut(&mut store.events, event_id);
        assert!(event.is_active, 1);
        assert!(event.sold_tickets < event.max_supply, 2);
        
        // Mint ticket
        let ticket = Ticket { event_id, owner: signer::address_of(buyer) };
        move_to(buyer, ticket);
        event.sold_tickets = event.sold_tickets + 1;
    }
    
    /// Set an entry gate
    public fun set_entry_gate(admin: &signer, event_id: u64, gate: address) {
        let store = borrow_global_mut<TicketingStore>(signer::address_of(admin));
        let event = table::borrow_mut(&mut store.events, event_id);
        event.entry_gate = some(gate);
    }
    
    /// Verify a ticket at entry gate
    public fun verify_entry(gate: &signer, ticket_owner: address, event_id: u64) {
        let ticket = borrow_global<Ticket>(ticket_owner);
        assert!(ticket.event_id == event_id, 3);
        move_from<Ticket>(ticket_owner);
    }
}
