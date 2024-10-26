import React, { createContext, useState, useContext, ReactNode } from 'react';

interface BookingDetails {
    firstName: string;
    lastName: string;
    myKad: string;
    email: string;
    contact: string;
    subtotal: number;
    ticket: BookItem;
}

interface TicketOption {
    id: string;
    title: string;
    price: number;
    image: string;
}

interface Traveler {
    type: 'adult' | 'senior' | 'child' | 'infant';
    count: number;
}

interface BookItem {
    id: string;
    image: string;
    name: string;
    option: TicketOption | null;
    date: string;
    time: string;
    quantity: number;
    travelers: Traveler[];
}

interface BookingHistoryContextType {
    bookingHistory: BookingDetails[];
    addBooking: (booking: BookingDetails) => void;
}

const BookingHistoryContext = createContext<BookingHistoryContextType | undefined>(undefined);

export const BookingHistoryProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [bookingHistory, setBookingHistory] = useState<BookingDetails[]>([]);

    const addBooking = (booking: BookingDetails) => {
        setBookingHistory(prev => [...prev, booking]);
    };

    return (
        <BookingHistoryContext.Provider value={{ bookingHistory, addBooking }}>
            {children}
        </BookingHistoryContext.Provider>
    );
};

export const useBookingHistory = () => {
    const context = useContext(BookingHistoryContext);
    if (!context) {
        throw new Error('useBookingHistory must be used within a BookingHistoryProvider');
    }
    return context;
};
