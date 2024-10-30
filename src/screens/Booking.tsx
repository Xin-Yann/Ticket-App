import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, TextInput, ImageBackground, ScrollView, TouchableOpacity, Image } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from './ThingsToDo';

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

type BookingPageProps = {
    navigation: StackNavigationProp<RootStackParamList, 'BookingPage'>;
    route: RouteProp<RootStackParamList, 'BookingPage'>;
};

const BookingPage: React.FC<BookingPageProps> = ({ navigation, route }) => {
    const { bookItem } = route.params;
    const [subtotal, setSubtotal] = useState(0);

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [myKad, setMyKad] = useState('');
    const [email, setEmail] = useState('');
    const [contact, setContact] = useState('');
    const [currentStep, setCurrentStep] = useState(1);
    const totalSteps = 3;


    useEffect(() => {
        const calculatedSubtotal = bookItem.travelers.reduce((sum, traveler) => {
            return sum + (traveler.count * (bookItem.option?.price || 0));
        }, 0);

        setSubtotal(calculatedSubtotal);
    }, [bookItem.option, bookItem.quantity, bookItem.travelers]);

    const handleConfirmBooking = () => {
        const bookingDetails = {
            firstName,
            lastName,
            myKad,
            email,
            contact,
            subtotal,
            ticket: bookItem,
        };

        navigation.navigate('PaymentPage', { bookingDetails });
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
                    <TouchableOpacity style={styles.iconButton} onPress={() => navigation.navigate('Home')}>
                        <Image source={require('../image/back-icon.png')} />
                    </TouchableOpacity>
                    <Text style={styles.title}>Fill In Booking Details</Text>
                </View>

                <ProgressBar />
                <ProgressLabels />
                
                <ScrollView
                    style={styles.scrollView}
                    keyboardShouldPersistTaps="handled"
                >

                    <View style={styles.cartItemContainer}>

                        <Text style={styles.itemName}>{bookItem.name}</Text>
                        <Text style={styles.date}>Date: {bookItem.date}</Text>
                        <Text style={styles.time}>Time: {bookItem.time}</Text>
                        {bookItem.travelers.map((traveler) =>
                            traveler.count > 0 ? (
                                <Text key={traveler.type} style={styles.travelerDetails}>
                                    Traveler: {traveler.type.charAt(0).toUpperCase() + traveler.type.slice(1)}
                                </Text>
                            ) : null
                        )}
                        <Text style={styles.quantity}>Quantity: {bookItem.quantity}</Text>
                        <Text style={styles.price}>Price: RM {bookItem.option?.price?.toFixed(2) || '0.00'}</Text>
                    </View>



                    <View style={styles.Formcontainer}>
                        <Text style={styles.textColor}> First Name </Text>
                        <TextInput
                            placeholder="First Name"
                            style={styles.input}
                            value={firstName}
                            onChangeText={setFirstName} 
                        />
                        <Text style={styles.textColor}> Last Name </Text>
                        <TextInput
                            placeholder="Last Name"
                            style={styles.input}
                            value={lastName}
                            onChangeText={setLastName} 
                        />
                        <Text style={styles.textColor}> MyKad (IC) </Text>
                        <TextInput
                            placeholder="MyKad (IC)"
                            style={styles.input}
                            value={myKad}
                            onChangeText={setMyKad}
                        />
                        <Text style={styles.textColor}> Email </Text>
                        <TextInput
                            placeholder="Email"
                            style={styles.input}
                            value={email}
                            onChangeText={setEmail}
                        />
                        <Text style={styles.textColor}> Contact </Text>
                        <TextInput
                            placeholder="Contact"
                            style={styles.input}
                            value={contact}
                            onChangeText={setContact}
                        />
                    </View>

                    <View style={styles.summaryContainer}>
                        <View style={styles.summaryRow}>
                            <Text style={styles.summaryText}>Subtotal:</Text>
                            <Text style={styles.summaryPrice}>RM {subtotal.toFixed(2)}</Text>
                        </View>
                        <View style={styles.summaryRow}>
                            <Text style={styles.summaryText}>Discount:</Text>
                            <Text style={styles.summaryPrice}>RM 0.00</Text>
                        </View>
                        <View style={styles.summaryRow}>
                            <Text style={styles.summaryText}>Total Price:</Text>
                            <Text style={styles.summaryPrice}>RM {subtotal.toFixed(2)}</Text>
                        </View>
                        <TouchableOpacity style={styles.checkoutButton} onPress={handleConfirmBooking}>
                            <Text style={styles.checkoutText}>Checkout</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>

            </View>

        </ImageBackground >
    );
};

const styles = StyleSheet.create({
    scrollView: {
        flexGrow: 1, 
    },
    backgroundImage: {
        flex: 1,
        resizeMode: 'contain', 
        justifyContent: 'center', 
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#001a33',
        marginRight: 35,
    },
    itemName: {
        fontSize: 18,
        marginBottom: 10,
        color: '#001a33'
    },
    itemDetails: {
        fontSize: 14,
        marginBottom: 10,
        color: '#001a33'
    },
    quantity: {
        fontSize: 14,
        marginBottom: 10,
        color: '#001a33'
    },
    price: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#001a33', 
        marginTop: 10, 
    },
    date: {
        fontSize: 14,
        marginBottom: 10,
        color: '#001a33'
    },
    time: {
        fontSize: 14,
        marginBottom: 10,
        color: '#001a33'
    },
    travelerDetails: {
        fontSize: 14,
        marginBottom: 10,
        color: '#001a33'
    },
    Formcontainer: {
        flex: 1,
        justifyContent: 'flex-start',
        padding: 30,
        borderRadius: 20,
        backgroundColor: '#fff',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 10,
        marginBottom: 10,
    },
    input: {
        height: 50,
        borderColor: '#B0C4DE',
        borderWidth: 1,
        borderRadius: 10,
        paddingHorizontal: 10,
        marginBottom: 30,
        backgroundColor: '#fff', 
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
        marginTop:20,
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
    cartItemContainer: {
        padding: 16,
        marginBottom: 30,
        backgroundColor: '#fff',
        borderRadius: 10,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 8,
        elevation: 4,
        marginTop: 20,

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

export default BookingPage;
