import React from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useBookingHistory } from './BookingHistoryContext';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { LogBox } from 'react-native';

LogBox.ignoreLogs([
    'VirtualizedLists should never be nested inside plain ScrollViews',
    'Got a component with the name cart for the screen cart.',
    'Encountered two children with the same key, `.$1`'
]);

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

interface BookingDetails {
    firstName: string;
    lastName: string;
    myKad: string;
    email: string;
    contact: string;
    subtotal: number;
    ticket: BookItem;
}

type RootStackParamList = {
    PaymentSuccess: undefined; 
    BookingHistory: { bookingHistory: BookingDetails[] }; 
};

type PaymentSuccessScreenNavigationProp = StackNavigationProp<RootStackParamList, 'PaymentSuccess'>;

const PaymentSuccess: React.FC = () => {
    const navigation = useNavigation<PaymentSuccessScreenNavigationProp>();
    const { bookingHistory } = useBookingHistory();

    const renderBookingItem = ({ item }: { item: BookingDetails }) => (
        <View style={styles.bookingItem}>
            <Image source={{ uri: item.ticket.image }} style={styles.ticketImage} />
            <Text style={styles.detail}>Name: {item.firstName} {item.lastName}</Text>
            <Text style={styles.detail}>Ticket: {item.ticket.name}</Text>
            <Text style={styles.detail}>Date: {item.ticket.date}</Text>
            <Text style={styles.detail}>Price: RM {item.subtotal.toFixed(2)}</Text>
        </View>
    );

    return (
        <View style={styles.container}>
            <View style={styles.iconContainer}>
                <Image source={require('../image/success.png')} style={styles.icon} />
            </View>
            <Text style={styles.congratsText}>Congratulations</Text>
            <Text style={styles.successText}>Your payment was successful</Text>
            <TouchableOpacity
                style={styles.viewTicketButton}
                onPress={() => navigation.navigate('BookingHistory', { bookingHistory })} 
            >
                <Text style={styles.buttonText}>View Ticket</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.continueShoppingButton}>
                <Text style={styles.continueText}>Continue Shopping</Text>
            </TouchableOpacity>

            <FlatList
                data={bookingHistory}
                renderItem={renderBookingItem}
                keyExtractor={(item) => item.ticket.id} 
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#F8F9FA',
    },
    iconContainer: {
        marginBottom: 30,
        marginTop:120,
        alignItems: 'center',
    },
    icon: {
        width: 80,
        height: 80,
    },
    congratsText: {
        fontSize: 30,
        fontWeight: 'bold',
        color: '#1C1C1E',
        textAlign: 'center',
        marginBottom: 10,
    },
    successText: {
        fontSize: 18,
        marginTop: 10,
        color: '#8E8E93',
        textAlign: 'center',
        marginBottom: 30,
    },
    viewTicketButton: {
        backgroundColor: '#001a33',
        paddingVertical: 12,
        paddingHorizontal: 30,
        marginTop: 20,
        borderRadius: 10,
        marginBottom: 20,
        marginLeft:100,
        width:150,
        height:60,
        alignItems: 'center',
    },
    buttonText: {
        marginTop:5,
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },
    continueShoppingButton: {
        borderWidth: 1,
        borderColor: '#D1D1D6',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 10,
        marginTop:30,
        marginLeft:80,
        width:200,
        height:60,
        alignItems: 'center',
    },
    continueText: {
        color: '#1C1C1E',
        fontSize: 16,
        marginTop:5,
        fontWeight: '600',
    },
    bookingItem: {
        display:'none',
    },
    ticketImage: {
        width: '100%',
        height: 150,
        borderRadius: 10,
        marginBottom: 10,
    },
    detail: {
        fontSize: 16,
        marginBottom: 5,
    },
});

export default PaymentSuccess;
