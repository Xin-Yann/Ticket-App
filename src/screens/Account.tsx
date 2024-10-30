import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, ImageBackground, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NavigationProp } from '@react-navigation/native';


import { LogBox } from 'react-native';

LogBox.ignoreLogs([
    'VirtualizedLists should never be nested inside plain ScrollViews',
    'Got a component with the name cart for the screen cart.',
]);

interface TicketOption {
    id: string;
    title: string;
    price: number;
    details: string;
    image: string;
}

interface ThingsToDoItem {
    id: string;
    title: string;
    rating: number;
    booked: string;
    price: string;
    location: string;
    desc: string;
    image: string;
    ticketOption: TicketOption[];
    date: string;
}

interface AttractionItem {
    id: string;
    image: string;
    desc: string;
    title: string;
    rating: number;
    booked: string;
    price: string;
    location: string;
    ticketOption: TicketOption[];
    date: string;
}


interface Traveler {
    type: 'adult' | 'senior' | 'child' | 'infant';
    count: number;
}

interface BookItem {
    id: string;
    image: string;
    name: string;
    option: TicketOption;
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

export type RootStackParamList = {
    ThingsToDo: undefined;
    ItemDetails: { item: ThingsToDoItem };
    Attractions: undefined;
    AttractionDetails: { item: AttractionItem };
    Cart: undefined;
    Home: undefined;
    BookingPage: { bookItem: BookItem };
    PackageOption: { item: ThingsToDoItem };
    PaymentPage: { bookingDetails: BookingDetails };
    BookingHistory: { bookingHistory: BookingDetails[] };
    PaymentSuccess: undefined;
    AccountScreen: undefined;
};

const AccountScreen = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();

    return (
        <ImageBackground source={require('../image/background.png')} style={styles.backgroundImage}>
            <View style={styles.container}>
                <ScrollView
                    style={styles.scrollView}
                    contentContainerStyle={styles.contentContainer}
                    keyboardShouldPersistTaps="handled"
                >
                    <View style={styles.header}>
                        <TouchableOpacity style={styles.iconButton} onPress={() => navigation.navigate('Home')}>
                            <Image source={require('../image/back-icon.png')} />
                        </TouchableOpacity>
                        <Text style={styles.title}>Account</Text>
                        <View style={styles.headerIcons}>
                            <TouchableOpacity style={styles.iconButton} onPress={() => navigation.navigate('Cart')}>
                                <Image source={require('../image/Shopping-cart.png')} />
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={styles.formContainer}>
                        <Text style={styles.label}>Username</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Hello, 123!"
                            value={username}
                            onChangeText={setUsername}
                        />

                        <Text style={styles.label}>Email</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Hello123@gmail.com"
                            value={email}
                            onChangeText={setEmail}
                            keyboardType="email-address"
                        />

                        <Text style={styles.label}>Password</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="*******"
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry
                        />

                        <TouchableOpacity style={styles.saveButton}>
                            <Text style={styles.saveButtonText}>Save</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </View>
            {/* Bottom Tab Bar */}
            <View style={styles.bottomNav}>

                <TouchableOpacity style={styles.iconButton} onPress={() => navigation.navigate('Home')}>
                    <View style={{ alignItems: 'center', marginBottom: 5, }}>
                        <Image source={require('../image/home-icon.png')} style={styles.iconImage} />
                        <Text style={styles.homeNav}>Home</Text>
                    </View>
                </TouchableOpacity>

                <TouchableOpacity style={styles.iconButton} onPress={() => navigation.navigate('BookingHistory', { bookingHistory: [] })}>
                    <View style={{ alignItems: 'center', marginBottom: 5 }}>
                        <Image source={require('../image/trips-icon.png')} style={styles.iconImage} />
                        <Text style={styles.homeNav}>Trips</Text>
                    </View>
                </TouchableOpacity>

                <TouchableOpacity style={styles.iconButton} onPress={() => navigation.navigate('AccountScreen')}>
                    <View style={{ alignItems: 'center', marginBottom: 5, }}>
                        <Image source={require('../image/account-icon.png')} style={styles.iconImage} />
                        <Text style={styles.homeNav}>Account</Text>
                    </View>
                </TouchableOpacity>
            </View>
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 16,
    },
    scrollView: {
        flexGrow: 1,
    },
    contentContainer: {
        paddingBottom: 20,
    },
    backgroundImage: {
        flex: 1,
        resizeMode: 'contain',
        justifyContent: 'center',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 10,
        marginTop: 12,
    },
    iconButton: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 15,
        marginTop: 8,
        marginRight: 10,
    },
    iconImage: {
        width: 30,
        height: 30,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#001a33',
        marginLeft: 25,
        marginTop: 10,
    },
    headerIcons: {
        flexDirection: 'row',
    },
    navBar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 16,
        paddingHorizontal: 8,
    },
    navTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'darkblue',
    },
    formContainer: {
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 30,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 5,
        marginVertical: 20,
        marginTop: 70,
    },
    label: {
        fontSize: 16,
        color: 'black',
        marginBottom: 8,
    },
    input: {
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        marginBottom: 20,
        fontSize: 16,
        paddingVertical: 8,
    },
    saveButton: {
        backgroundColor: '#001a33',
        paddingVertical: 12,
        borderRadius: 6,
        alignItems: 'center',
    },
    saveButtonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
    tabBar: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingVertical: 12,
        backgroundColor: 'white',
        borderTopWidth: 1,
        borderTopColor: '#ccc',
    },
    bottomNav: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        padding: 10,
        backgroundColor: '#fff',
        borderTopColor: '#ddd',
        borderTopWidth: 1,
    },
    homeNav: {
        flexDirection: 'row',
    }
});

export default AccountScreen;
