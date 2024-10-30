import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity, ImageBackground, ScrollView, Modal } from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { NavigationProp } from '@react-navigation/native';
import { LogBox } from 'react-native';

LogBox.ignoreLogs([
    'VirtualizedLists should never be nested inside plain ScrollViews',
    'Got a component with the name cart for the screen cart.',
]);


interface NavItemProps {
    title: string;
    icon: any;
}

interface TicketOption {
    id: string;
    title: string;
    price: number;
    details: string;
    image: string;
}

interface EventItem {
    id: string;
    title: string;
    price: string;
    location: string;
    desc: string;
    image: string;
    date: string;
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

type ThingsToDoScreenNavigationProp = StackNavigationProp<RootStackParamList, 'ThingsToDo'>;

type Props = {
    navigation: ThingsToDoScreenNavigationProp;
};

type PriceRangeKey = 'range1' | 'range2' | 'range3' | 'range4' | 'range5';

interface ItemType {
    price: string;
    location: string;
    date: string; 
}

interface PriceFilterModalProps {
    visible: boolean;
    onClose: () => void;
    onApply: (selectedRanges: Record<string, boolean>, selectedLocations: string[], selectedMonths: string[]) => void;
    checkedRanges: Record<PriceRangeKey, boolean>; 
    setCheckedRanges: React.Dispatch<React.SetStateAction<Record<PriceRangeKey, boolean>>>; 
    selectedLocations: string[]; 
    setSelectedLocations: React.Dispatch<React.SetStateAction<string[]>>; 
    selectedMonths: string[]; 
    setSelectedMonths: React.Dispatch<React.SetStateAction<string[]>>;
}

const ThingsToDo = () => {
    const [items, setItems] = useState<EventItem[]>([]);
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();
    const [filteredItems, setFilteredItems] = useState<any[]>([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [checkedRanges, setCheckedRanges] = useState<Record<PriceRangeKey, boolean>>({
        range1: false,
        range2: false,
        range3: false,
        range4: false,
        range5: false,
    });
    const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
    const [selectedMonths, setSelectedMonths] = useState<string[]>([]);

    useEffect(() => {
        const initialItems: EventItem[] = [
            {
                id: '1',
                date: '04 May 2024',
                title: 'Wesak Day',
                price: '',
                desc: 'Wesak Day is observed by devotees to celebrate Buddha birthday, enlightenment and achievement of Nirvana.',
                location: 'Georgetown',
                image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTf_HFkjydT4P6Y-Lp6ABTaIMy4L2eTn5XDVg&s'

            },
            {
                id: '2',
                date: '07 July 2024',
                title: 'George Town Heritage Celebrations 2024',
                price: 'Free',
                location: 'Georgetown',
                desc: 'George Town Heritage Celebrations is an annual community-powered event that commemorates the inscription of George Town as a UNESCO World Heritage Site on 7 July 2008.',
                image: 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgRsIGq3BsxNbMe6wptKfp8ZlFTPQhyphenhyphench2gY9-j_8ju7trqJOM5wMXHHukewLx1B76KZupDjHxrWuIe8hU-Lz_tyWxdnojpd9Y_EqUYlzQ_3IkpXMgB9vBAKMllmuYBoF_qScFR4hsg0Zc/s1600/IMG_8423.jpg'
            },
            {
                id: '3',
                date: '31 August 2024',
                title: 'Merdeka Day',
                price: 'Free',
                desc: 'To commemorate Malaysia Independence Day, an annual Merdeka Parade will be organised by the Penang State Government where contingents representing various government agencies will be taking part in the occasion.',
                location: 'Georgetown',
                image: 'data:image/jpeg;base64,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'
            },
            {
                id: '4',
                date: '07 July 2024',
                title: 'Penang Hill Railway: A Centenary Celebration (2024)',
                price: 'Free',
                location: 'Ayer Itam',
                desc: 'Penang Hill Corporation is hosting a series of events in the run- up to the 100th anniversary of the Penang Hill Railway on 21 October 2024. ',
                image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSSHo-6LO441SB9dz9FxKGh6qzjVqc44ZTNkw&s'
            },
        ];

        initialItems.forEach(item => {
            const month = getMonthFromDateString(item.date);
            console.log(`Item Date: ${item.date}, Month: ${month}`);
        });

        setItems(initialItems);
        setFilteredItems(initialItems);
    }, []);

    const renderItem = ({ item }: { item: AttractionItem }) => (
        <View style={styles.card}>
            <Image source={{ uri: item.image }} style={styles.image} />
            <View style={styles.cardContent}>
                <Text style={styles.cardTitle}>{item.title}</Text>
                <Text style={styles.price}>Event Date: {item.date}</Text>
                <Text style={styles.desc}>{item.desc}</Text>
            </View>
        </View>
    );

    const toggleModal = () => {
        setModalVisible((prev) => !prev);
    };

    const getMonthFromDateString = (dateString: string): string => {
        const [day, month, year] = dateString.split(' ');
        const monthMapping: { [key: string]: number } = {
            January: 0,
            February: 1,
            March: 2,
            April: 3,
            May: 4,
            June: 5,
            July: 6,
            August: 7,
            September: 8,
            October: 9,
            November: 10,
            December: 11,
        };

        const date = new Date(Number(year), monthMapping[month], Number(day));

        return date.toLocaleString('default', { month: 'long' });
    };

    const applyPriceFilter = (
        selectedRanges: Record<string, boolean>,
        selectedLocations: string[],
        selectedMonths: string[]
    ) => {
        const noRangesSelected = Object.values(selectedRanges).every(value => !value);
        const noLocationsSelected = selectedLocations.length === 0;
        const noMonthsSelected = selectedMonths.length === 0;

        if (noRangesSelected && noLocationsSelected && noMonthsSelected) {
            console.log('No filters applied. Displaying all items.');
            setFilteredItems(items);
            setModalVisible(false);
            return;
        }

        const filtered = items.filter((item) => {
            const priceValue = item.price === 'Free' ? 0 : parseFloat(item.price.replace(/[^0-9.-]+/g, ''));

            const noRangesSelected = Object.values(selectedRanges).every(value => !value);
            const priceMatch = noRangesSelected || (
                (selectedRanges.range1 && priceValue >= 0 && priceValue <= 20) ||
                (selectedRanges.range2 && priceValue > 20 && priceValue <= 40) ||
                (selectedRanges.range3 && priceValue > 40 && priceValue <= 60) ||
                (selectedRanges.range4 && priceValue > 60 && priceValue <= 80) ||
                (selectedRanges.range5 && priceValue > 80)
            );

            const locationMatch = noLocationsSelected || selectedLocations.includes(item.location);

            const itemMonth = getMonthFromDateString(item.date);
            const monthMatch = noMonthsSelected || selectedMonths.includes(itemMonth);

            console.log(`Item: ${item.price || item.date || item.location}`);
            console.log(`Price Value: ${priceValue}`);
            console.log(`Price Match: ${priceMatch}`);
            console.log(`Location Match: ${locationMatch}`);
            console.log(`Month Match: ${monthMatch}`);

            return priceMatch && locationMatch && monthMatch;
        });

        console.log('Filtered items:', filtered);
        setFilteredItems(filtered);
        setModalVisible(false);
    };

    const PriceFilterModal: React.FC<PriceFilterModalProps> = ({
        visible,
        onClose,
        onApply,
        checkedRanges,
        setCheckedRanges,
        selectedLocations,
        setSelectedLocations,
        selectedMonths,
        setSelectedMonths,
    }) => {
        const locations = ['Georgetown', 'Ayer Itam', 'Bayan Lepas', 'Jelutong', 'Tanjung Bungah', 'Batu Ferringhi'];
    
        const handleCheckboxChange = (range: PriceRangeKey) => {
            setCheckedRanges((prev) => ({
                ...prev,
                [range]: !prev[range],
            }));
        };
    
        const toggleLocationSelection = (location: string) => {
            setSelectedLocations((prev) =>
                prev.includes(location) ? prev.filter((loc) => loc !== location) : [...prev, location]
            );
        };
    
        const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    
        const toggleMonthSelection = (month: string) => {
            setSelectedMonths((prev) =>
                prev.includes(month) ? prev.filter(m => m !== month) : [...prev, month]
            );
        };
    
        const handleReset = () => {
            setCheckedRanges({
                range1: false,
                range2: false,
                range3: false,
                range4: false,
                range5: false,
            });
            setSelectedLocations([]);
            setSelectedMonths([]);
        };
    
        const handleApply = () => {
            console.log('Selected Ranges:', checkedRanges);
            console.log('Selected Locations:', selectedLocations);
            console.log('Selected Months:', selectedMonths);
            onApply(checkedRanges, selectedLocations, selectedMonths);
        };
    
        return (
            <Modal
                animationType="slide"
                transparent={true}
                visible={visible}
                onRequestClose={onClose}
            >
                <ScrollView
                    style={styles.scrollView}
                    keyboardShouldPersistTaps="handled"
                >
                    <View style={styles.modalContainer}>
                        <View style={styles.modalContent}>
                            <TouchableOpacity onPress={onClose}>
                                <Image source={require('../image/close.png')} style={styles.iconClose} />
                            </TouchableOpacity>
    
                            <View style={{ flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between' }}>
                                <TouchableOpacity onPress={handleApply} style={styles.applyButton}>
                                    <Text style={styles.applyButtonText}>Apply</Text>
                                </TouchableOpacity>
    
                                <TouchableOpacity onPress={handleReset} style={styles.resetButton}>
                                    <Text style={styles.resetButtonText}>Reset Filters</Text>
                                </TouchableOpacity>
                            </View>
                            <Text style={styles.modalTitle}>Locations</Text>
                            {locations.map((location) => (
                                <View key={location} style={styles.checkboxItem}>
                                    <CheckBox
                                        value={selectedLocations.includes(location)}
                                        onValueChange={() => toggleLocationSelection(location)}
                                    />
                                    <Text>{location}</Text>
                                </View>
                            ))}
    
                            <Text style={styles.modalTitle}>Price Range</Text>
                            <View style={styles.checkboxContainer}>
                                {Object.keys(checkedRanges).map((range, index) => (
                                    <View key={index} style={styles.checkboxItem}>
                                        <CheckBox
                                            value={checkedRanges[range as PriceRangeKey]}
                                            onValueChange={() => handleCheckboxChange(range as PriceRangeKey)}
                                        />
                                        <Text>{`RM ${index * 20} - RM ${index * 20 + 20}`}</Text>
                                    </View>
                                ))}
                            </View>
    
                            <Text style={styles.modalTitle}>Month</Text>
                            <View style={styles.checkboxContainer}>
                                {months.map((month) => (
                                    <View key={month} style={styles.checkboxItem}>
                                        <CheckBox
                                            value={selectedMonths.includes(month)}
                                            onValueChange={() => toggleMonthSelection(month)}
                                        />
                                        <Text style={styles.checkboxLabel}>{month}</Text>
                                    </View>
                                ))}
                            </View>
                        </View>
                    </View>
                </ScrollView>
            </Modal>
        );
    };
    

    return (
        <ImageBackground source={require('../image/background.png')} style={styles.backgroundImage}>

            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.contentContainer}
                keyboardShouldPersistTaps="handled"
            >
                <View style={styles.container}>

                    <View style={styles.header}>
                        <TouchableOpacity style={styles.iconButton} onPress={() => navigation.navigate('Home')}>
                            <Image source={require('../image/back-icon.png')} />
                        </TouchableOpacity>
                        <Text style={styles.title}>Events</Text>
                        <View style={styles.headerIcons}>
                            <TouchableOpacity style={styles.iconButton} onPress={() => navigation.navigate('Cart')}>
                                <Image source={require('../image/Shopping-cart.png')} />
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={styles.filterIcon}>
                        <TouchableOpacity style={styles.iconButton} onPress={toggleModal}>
                            <NavItem title="" icon={require('../image/filter.png')} />
                            <Text style={styles.filterText}>Filter</Text>
                        </TouchableOpacity>
                    </View>

                    <PriceFilterModal
                        visible={modalVisible}
                        onClose={toggleModal}
                        onApply={applyPriceFilter}
                        checkedRanges={checkedRanges} 
                        setCheckedRanges={setCheckedRanges} 
                        selectedLocations={selectedLocations}
                        setSelectedLocations={setSelectedLocations} 
                        selectedMonths={selectedMonths}
                        setSelectedMonths={setSelectedMonths} 
                    />

                    <View style={{ flex: 1 }}>
                        <FlatList
                            data={filteredItems}
                            keyExtractor={(item) => item.id}
                            renderItem={renderItem}
                        />
                    </View>
                </View>
            </ScrollView>

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
        </ImageBackground >
    );
};

const NavItem: React.FC<NavItemProps> = ({ title, icon }) => {
    return (
        <TouchableOpacity style={styles.navItem}>
            <Image source={icon} style={styles.navIcon} />
            <Text style={styles.navText}>{title}</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 10,
    },
    backgroundImage: {
        flex: 1,
        resizeMode: 'contain',
        justifyContent: 'center',
    },
    scrollView: {
        flexGrow: 1,
    },
    contentContainer: {
        paddingBottom: 20,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 10,
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
    filterIcon: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        paddingRight: 25,
        marginTop: 8,
        marginBottom: 15,
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
    list: {
        padding: 16,
    },
    card: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        marginBottom: 30,
        padding: 16,
        marginLeft: 25,
        marginRight: 25,
        borderRadius: 10,
        shadowColor: '#0000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 1,
        shadowRadius: 3,
        elevation: 5,
    },
    image: {
        width: 90,
        height: 90,
        alignSelf: 'center',
        borderRadius: 10,
        marginRight: 20,
        marginLeft: 10,
    },
    desc: {
        marginTop: 10,
        fontSize: 10,
        color: '#001a33',
        width: 180,
    },
    cardContent: {
        justifyContent: 'center',
        padding: 5,
        marginLeft: 5,
    },
    cardTitle: {
        width: 200,
        fontSize: 16,
        color: '#001a33',
        fontWeight: 'bold',
    },
    price: {
        marginTop: 20,
        fontSize: 12,
        color: '#001a33',
        fontWeight: 'bold',
    },
    bottomNavigation: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        padding: 16,
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderColor: '#ddd',
    },
    filterText: {
        marginLeft: 15,
        marginBottom: 15,
        color: '#001a33',
    },
    rowContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        width: '100%',
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 20,
        alignItems: 'flex-start',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
        marginTop: 25,
    },
    iconClose: {
        width: 10,
        height: 10,
        marginTop: 20,
        marginLeft: 290,
        marginBottom: 10,
    },
    closeButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    checkboxContainer: {
        width: '100%',
        alignItems: 'flex-start',
    },
    checkboxItem: {
        flexDirection: 'row',
        marginVertical: 5,
    },
    checkboxLabel: {
        marginLeft: 8,
    },
    applyButton: {
        backgroundColor: '#fff',
        padding: 10,
        borderRadius: 10,
        marginTop: 20,
        marginLeft: 100,
        marginRight: 20,
        alignItems: 'center',
        borderWidth: 1,
        width: 100
    },
    applyButtonText: {
        color: '#001a33',
        fontWeight: 'bold',
    },
    resetButton: {
        backgroundColor: '#f44336',
        padding: 10,
        borderRadius: 5,
        marginLeft: 0,
        alignItems: 'center',
        marginTop: 20,
    },
    resetButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    navIcon: {
        marginTop: 5,
        width: 30,
        height: 25,
    },
    navItem: {
        alignItems: 'center',
    },
    navText: {
        fontSize: 12,
        marginTop: 5,
        color: '#333',
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

export default ThingsToDo;
