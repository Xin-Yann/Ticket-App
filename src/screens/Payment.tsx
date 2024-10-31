import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ImageBackground, ScrollView, Image } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from './ThingsToDo';
import { useBookingHistory } from './BookingHistoryContext';

type PaymentPageProps = {
    navigation: StackNavigationProp<RootStackParamList, 'PaymentPage'>;
    route: RouteProp<RootStackParamList, 'PaymentPage'>;
};

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

const PaymentPage: React.FC<PaymentPageProps> = ({ navigation, route }) => {
    const { bookingDetails } = route.params as { bookingDetails: BookingDetails }; 
    const { addBooking } = useBookingHistory();
    const [selectedTab, setSelectedTab] = useState<'CreditCard' | 'TNG'>('CreditCard');
    const [currentStep, setCurrentStep] = useState(2);
    const totalSteps = 3;

    const renderPaymentForm = () => {
        if (selectedTab === 'CreditCard') {
            return (
                <View style={styles.formContainer}>
                    <TextInput style={styles.input} placeholder="Card Number" keyboardType="number-pad" />
                    <TextInput style={styles.input} placeholder="Cardholder Name" />
                    <View style={styles.row}>
                        <TextInput style={[styles.input, styles.smallInput]} placeholder="CVV" keyboardType="number-pad" />
                        <TextInput style={[styles.input, styles.smallInput]} placeholder="Expiry (MM/YY)" keyboardType="number-pad" />
                    </View>
                </View>
            );
        } else if (selectedTab === 'TNG') {
            return (
                <View style={styles.formContainer}>
                    <View style={{ alignItems: 'center', marginBottom: 20, marginTop: 20 }}>
                    <Image source={require('../image/qr-code.png')} />
                    </View>
                </View>
            );
        }
    };
    const handleCheckout = () => {
        addBooking(bookingDetails); 
        navigation.navigate('PaymentSuccess'); 
    };

    const ProgressBar = () => {
        return (
            <View style={styles.progressContainer}>
                {Array.from({ length: totalSteps }, (_, index) => (
                    <View
                        key={index}
                        style={[
                            styles.progressStep,
                            index < currentStep ? styles.progressStepActive : styles.progressStepInactive
                        ]}
                    />
                ))}
            </View>
        );
    };

    const ProgressLabels = () => {
        const labels = ['Booking', 'Payment', 'Confirmation'];
        return (
            <View style={styles.labelContainer}>
                {labels.map((label, index) => (
                    <Text
                        key={index}
                        style={[
                            styles.labelText,
                            index < currentStep ? styles.labelActive : styles.labelInactive
                        ]}
                    >
                        {label}
                    </Text>
                ))}
            </View>
        );
    };

    return (
        <ImageBackground source={require('../image/background.png')} style={styles.backgroundImage}>
            <View style={styles.container}>
            <View style={styles.header}>
                    <TouchableOpacity style={styles.iconButton} onPress={() => navigation.goBack()}>
                        <Image source={require('../image/back-icon.png')} />
                    </TouchableOpacity>
                    <Text style={styles.Headertitle}>Payment</Text>
                </View>

                <ProgressBar />
                <ProgressLabels />

                <ScrollView
                    style={styles.scrollView}
                    keyboardShouldPersistTaps="handled"
                >
            
                    <View style={styles.bookingDetailsContainer}>

                        <Text style={styles.ticketName}>{bookingDetails.ticket.name}</Text>
                        <Text style={styles.detail}>Date: {bookingDetails.ticket.date}</Text>
                        <Text style={styles.detail}>Time: {bookingDetails.ticket.time}</Text>
                        {bookingDetails.ticket.travelers.map((traveler, index) => (
                            traveler.count > 0 ? (
                                <Text key={index} style={styles.detail}>Traveler: 
                                    {` ${traveler.type.charAt(0).toUpperCase() + traveler.type.slice(1)}`}
                                </Text>
                            ) : null
                        ))}
                        <Text style={styles.detail}>Quantity: {bookingDetails.ticket.quantity}</Text>
                        <Text style={styles.detail}>Price: RM {bookingDetails.ticket.option?.price?.toFixed(2) || '0.00'}</Text>
                        
                        <Text style={styles.title}>Booking Details:</Text>
                        <Text style={styles.detail}>Name: {bookingDetails.firstName} {bookingDetails.lastName}</Text>
                        <Text style={styles.detail}>MyKad: {bookingDetails.myKad}</Text>
                        <Text style={styles.detail}>Email: {bookingDetails.email}</Text>
                        <Text style={styles.detail}>Contact: {bookingDetails.contact}</Text>
                    </View>

                    <View style={styles.tabsContainer}>
                        <TouchableOpacity
                            style={[styles.tab, selectedTab === 'CreditCard' && styles.activeTab]}
                            onPress={() => setSelectedTab('CreditCard')}
                        >
                            <Text style={[styles.tabText, selectedTab === 'CreditCard' && styles.activeTabText]}>Credit Card</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.tab, selectedTab === 'TNG' && styles.activeTab]}
                            onPress={() => setSelectedTab('TNG')}
                        >
                            <Text style={[styles.tabText, selectedTab === 'TNG' && styles.activeTabText]}>TNG</Text>
                        </TouchableOpacity>
                    </View>

                    {renderPaymentForm()}

                    <View style={styles.summaryContainer}>
                        <View style={styles.summaryRow}>
                            <Text style={styles.summaryText}>Subtotal:</Text>
                            <Text style={styles.summaryPrice}>RM {bookingDetails.subtotal.toFixed(2)}</Text>
                        </View>
                        <View style={styles.summaryRow}>
                            <Text style={styles.summaryText}>Discount:</Text>
                            <Text style={styles.summaryPrice}>RM 0.00</Text>
                        </View>
                        <View style={styles.summaryRow}>
                            <Text style={styles.summaryText}>Total Price:</Text>
                            <Text style={styles.summaryPrice}>RM {bookingDetails.subtotal.toFixed(2)}</Text>
                        </View>
                        <TouchableOpacity style={styles.checkoutButton} onPress={handleCheckout}>
                            <Text style={styles.checkoutText}>Pay</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </View >

        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    scrollView: {
        flexGrow: 1, 
    },
    container: {
        padding: 20,
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 10,
        marginBottom: 10,
    },
    title: {
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: 10,
        marginTop: 30,
        color: '#001a33',
    },
    backgroundImage: {
        flex: 1,
        resizeMode: 'contain', 
        justifyContent: 'center', 
    },
    detail: {
        fontSize: 14,
        marginVertical: 5,
        color: '#001a33',
    },
    ticketName: {
        fontSize: 16,
        marginVertical: 5,
        color: '#001a33',
        fontWeight: 'bold',
        marginBottom:20,
    },
    tabsContainer: {
        flexDirection: 'row',
    },
    tab: {
        flex: 1,
        padding: 10,
        backgroundColor: '#E0E0E0',
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 5,
        shadowOffset: { width: 0, height: 2 },
    },
    tabText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    formContainer: {
        backgroundColor: '#FFF',
        borderRadius: 10,
        padding: 20,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 5,
        shadowOffset: { width: 0, height: 2 },
    },
    input: {
        backgroundColor: '#F0F0F0',
        borderRadius: 10,
        padding: 10,
        marginBottom: 15,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    smallInput: {
        width: '48%',
    },
    bookingDetailsContainer: {
        backgroundColor: '#FFF',
        borderRadius: 10,
        padding: 20,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 5,
        shadowOffset: { width: 0, height: 2 },
    },
    text: {
        fontSize: 14,
        marginBottom: 5,
    },
    textBold: {
        fontSize: 14,
        fontWeight: 'bold',
    },
    activeTab: {
        backgroundColor: '#fff',
    },
    activeTabText: {
        color: '#000',
    },
    summary: {
        marginVertical: 20,
        padding: 10,
        borderRadius: 10,
        backgroundColor: '#F0F8FF', 
    },
    summaryContainer: {
        padding: 16,
        backgroundColor: '#fff',
        borderRadius: 10,
        height: 240
    },
    summaryRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20, 
    },
    summaryText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#001a33',
    },
    summaryPrice: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#001a33',
    },
    checkoutButton: {
        backgroundColor: '#003366',
        paddingVertical: 16,
        marginTop: 20,
        borderRadius: 8,
        alignItems: 'center',
    },
    checkoutText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    headerIcons: {
        flexDirection: 'row',
    },
    iconButton: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: -5,
    },
    iconImage: {
        width: 30,
        height: 30,
    },
    textColor: {
        color: '#001a33',
        marginBottom: 15,
        fontWeight: 'bold',
    },
    Headertitle: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
        marginTop: 10,
        color: '#001a33',
        marginRight:110,
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        marginTop: 10,
    },
    progressContainer: { 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        marginVertical: 20 
    },
    progressStep: { 
        flex: 1, 
        height: 8, 
        marginHorizontal: 4, 
        borderRadius: 4 
    },
    progressStepActive: { 
        backgroundColor: '#001a33' 
    },
    progressStepInactive: { 
        backgroundColor: '#D3D3D3' 
    },
    labelContainer: { 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        marginBottom: 20 
    },
    labelText: { 
        fontSize: 14, 
        textAlign: 'center', 
        flex: 1 
    },
    labelActive: { 
        color: '#001a33', 
        fontWeight: 'bold' 
    },
    labelInactive: { 
        color: 'gray' 
    }
});

export default PaymentPage;
