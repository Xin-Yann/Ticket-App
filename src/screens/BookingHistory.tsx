import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Image, ImageBackground, Modal, ScrollView } from 'react-native';
import { useBookingHistory } from './BookingHistoryContext';
import { useNavigation } from '@react-navigation/native';
import { NavigationProp } from '@react-navigation/native';
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


const BookingHistory: React.FC = () => {
    const { bookingHistory } = useBookingHistory();
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();
    const [modalVisible, setModalVisible] = useState(false);

    const renderBookingItem = ({ item }: { item: BookingDetails }) => (
        <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollViewContent}>
            <View style={styles.bookingCard}>
                <TouchableOpacity style={{ flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center' }} onPress={() => setModalVisible(true)}>
                    <Text style={styles.viewQR}>View QR</Text>
                    <Image source={require('../image/back-right.png')} style={styles.iconback} />
                </TouchableOpacity>

                <Text style={styles.ticketTitle}>{item.ticket.name}</Text>
                <Text style={styles.detail}>Date: {item.ticket.date} | Time: {item.ticket.time}</Text>
                <Text style={styles.detail}>
                    Travelers:{" "}
                    {item.ticket.travelers
                        .filter((t) => t.count > 0)
                        .map((t) => `${t.type.charAt(0).toUpperCase() + t.type.slice(1)}`)
                        .join(', ')}
                </Text>
                <Text style={styles.detail}>Quantity: {item.ticket.quantity}</Text>
                <Text style={styles.detail}>Total: RM {item.subtotal.toFixed(2)}</Text>

                <Text style={styles.sectionTitle}>Booking Details:</Text>
                <Text style={styles.detail}>Name: {item.firstName} {item.lastName}</Text>
                <Text style={styles.detail}>IC: {item.myKad}</Text>
                <Text style={styles.detail}>Email: {item.email}</Text>
                <Text style={styles.detail}>Contact: {item.contact}</Text>

                <Modal
                    visible={modalVisible}
                    transparent={true}
                    animationType="slide"
                    onRequestClose={() => setModalVisible(false)}
                >
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalContent}>
                            <TouchableOpacity onPress={() => setModalVisible(false)} >
                                <Image source={require('../image/close.png')} style={styles.iconClose} />
                            </TouchableOpacity>
                            <Text style={styles.ticketTitle}>{item.ticket.name}</Text>
                            <Text style={styles.detail}>Date: {item.ticket.date} | Time: {item.ticket.time}</Text>
                            <Text style={styles.detail}>
                                Travelers:{" "}
                                {item.ticket.travelers
                                    .filter((t) => t.count > 0)
                                    .map((t) => `${t.type.charAt(0).toUpperCase() + t.type.slice(1)}`)
                                    .join(', ')}
                            </Text>
                            <Text style={styles.detail}>Quantity: {item.ticket.quantity}</Text>
                            <Text style={styles.detail}>Total: RM {item.subtotal.toFixed(2)}</Text>
                            <Image source={require('../image/qr-code.png')} style={styles.qrImage} />

                        </View>
                    </View>
                </Modal>
            </View>
        </ScrollView>
    );

    return (
        <ImageBackground source={require('../image/background.png')} style={styles.backgroundImage}>
            <View style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity style={styles.iconButton} onPress={() => navigation.navigate('Home')}>
                        <Image source={require('../image/back-icon.png')} />
                    </TouchableOpacity>
                    <Text style={styles.title}>Trips</Text>
                    <View style={styles.headerIcons}>
                        <TouchableOpacity style={styles.iconButton} onPress={() => navigation.navigate('Cart')}>
                            <Image source={require('../image/Shopping-cart.png')} />
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={styles.tabsContainer}>
                    <Text style={styles.activeTab}>Upcoming</Text>
                    <Text style={styles.inactiveTab}>Past Bookings</Text>
                </View>

                <FlatList
                    data={bookingHistory}
                    renderItem={renderBookingItem}
                    keyExtractor={(item, index) => index.toString()}
                />
            </View>

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
        padding: 20,
    },
    scrollView: {
        flexGrow: 1,
    },
    scrollViewContent: {
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
        marginBottom: 10,
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
    },
    textColor: {
        color: '#001a33',
        marginBottom: 15,
        fontWeight: 'bold',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        marginTop: 10,
        color: '#001a33',
    },
    tabsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 20,
    },
    activeTab: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#000',
        marginRight: 100,
        borderBottomWidth: 1,
        borderBottomColor: '#001a33',
        paddingBottom: 5,
    },
    inactiveTab: {
        fontSize: 14,
        color: '#999',
    },
    bookingCard: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 20,
        marginBottom: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 15 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
        marginTop: 10,
    },
    ticketTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#001a33',
        marginBottom: 15,
    },
    viewQR: {
        color: '#001a33',
        fontWeight: '600',
        textAlign: 'right',
        marginBottom: 15,
    },
    qrImage: {
        width: 200,  
        height: 200,
        alignSelf: 'center',  
        marginTop: 20,
        marginBottom: 20,
    },
    detail: {
        fontSize: 12,
        color: '#333',
        marginBottom: 10,
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        marginTop: 25,
        marginBottom: 5,
        color: '#001a33',
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        width: '80%',
        padding: 20,
        backgroundColor: 'white',
        borderRadius: 10,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    iconClose: {
        width: 10,
        height: 10,
        marginTop: 0,
        marginLeft: 255,
        marginBottom: 20,
    },
    iconback: {
        width: 10,
        height: 10,
        marginTop: 2,
        marginLeft: 8,
        marginBottom: 15,
    },
});

export default BookingHistory;
