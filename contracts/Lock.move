module Lock {
    use std::signer;
    use std::vector;
    use aptos_framework::coin;
    use aptos_framework::timestamp;

    // Define the Lock resource
    struct Lock has key, store {
        unlock_time: u64,
        owner: address,
        balance: u64
    }

    // Event for withdrawal
    struct WithdrawalEvent has drop, store {
        amount: u64,
        timestamp: u64,
    }

    // Event storage
    struct Events has key {
        events: vector<WithdrawalEvent>
    }

    // Initialize the module
    public entry fun initialize(account: &signer, unlock_time: u64, initial_balance: u64) {
        let owner = signer::address_of(account);

        // Ensure unlock time is in the future
        assert!(timestamp::now_seconds() < unlock_time, 100);

        // Save Lock data to the account
        move_to(account, Lock {
            unlock_time,
            owner,
            balance: initial_balance
        });

        // Store events
        move_to(account, Events { events: vector::empty<WithdrawalEvent>() });
    }

    // Withdraw funds
    public entry fun withdraw(account: &signer) acquires Lock, Events {
        let sender = signer::address_of(account);
        let lock = borrow_global_mut<Lock>(sender);

        // Ensure unlock time has passed
        assert!(timestamp::now_seconds() >= lock.unlock_time, 101);
        assert!(lock.owner == sender, 102); // Only owner can withdraw

        // Emit event
        let events = borrow_global_mut<Events>(sender);
        vector::push_back(&mut events.events, WithdrawalEvent {
            amount: lock.balance,
            timestamp: timestamp::now_seconds()
        });

        // Transfer funds
        let amount = lock.balance;
        lock.balance = 0;
        coin::transfer(account, sender, amount);
    }
}
