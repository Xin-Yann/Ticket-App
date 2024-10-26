import React, { useState, useContext } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ImageBackground, ScrollView, Modal } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from './ThingsToDo';
import { Picker } from '@react-native-picker/picker';
import { Calendar } from 'react-native-calendars';
import { CartContext } from '../screens/CartContext';

type ItemDetailsScreenProps = {
  navigation: StackNavigationProp<RootStackParamList, 'ItemDetails'>;
  route: RouteProp<RootStackParamList, 'ItemDetails'>;
};

interface TicketOption {
  id: string;
  title: string;
  price: number;
  description?: string;
  details: string;
  image: string;
}

interface CartItem {
  id: string;
  name: string;
  option: TicketOption | null;
  date: string;
  time: string;
  quantity: number;
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
  option: TicketOption;
  quantity: number;
  date: string;
  time: string;
  travelers: Traveler[];
}


const PackageOption: React.FC<ItemDetailsScreenProps> = ({ navigation, route }) => {
  const { item } = route.params;
  const [modalVisible, setModalVisible] = useState(false);
  const [isSelectModalVisible, setSelectModalVisible] = useState(false);
  const [isDetailsModalVisible, setDetailsModalVisible] = useState(false);

  const [selectedOption, setSelectedOption] = useState<TicketOption | null>(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('12:00 PM');
  const [adults, setAdults] = useState(1);
  const [seniors, setSeniors] = useState(0);
  const [children, setChildren] = useState(0);
  const [infants, setInfants] = useState(0);
  const { addToCart } = useContext(CartContext) || { addToCart: () => { } };


  const handleSelectOption = (option: TicketOption) => {
    setSelectedOption(option);
    setSelectModalVisible(true);
  };

  const handleSeeDetails = (option: TicketOption) => {
    setSelectedOption(option);
    setDetailsModalVisible(true);
  };

  const handleAddToCart = () => {
    const quantity = adults + seniors + children + infants;

    if (selectedOption) {
      const cartItem: CartItem = {
        id: selectedOption.id,
        image: selectedOption.image,
        name: selectedOption.title,
        option: selectedOption,
        date: selectedDate,
        time: selectedTime,
        quantity,
      };

      console.log('Adding to cart:', cartItem);
      addToCart(cartItem);
      setModalVisible(false);

    } else {
      console.log('No option selected!');
    }
  };

  const handleBookNow = () => {
    const quantity = adults + seniors + children + infants;

    if (selectedOption && quantity > 0) {
      const bookItem: BookItem = {
        id: selectedOption.id,
        image: selectedOption.image,
        name: selectedOption.title,
        option: selectedOption,
        quantity,
        date: selectedDate,
        time: selectedTime,
        travelers: [
          { type: 'adult', count: adults },
          { type: 'senior', count: seniors },
          { type: 'child', count: children },
          { type: 'infant', count: infants }
        ]
      };

      console.log('Booking item:', bookItem);
      setModalVisible(false);

      navigation.navigate('BookingPage', { bookItem });
    } else {
      console.log('No option selected or quantity is zero!');
    }

    setSelectModalVisible(false);
  };

  const incrementTraveler = (type: 'adult' | 'senior' | 'child' | 'infant') => {
    if (type === 'adult') setAdults(adults + 1);
    if (type === 'senior') setSeniors(seniors + 1);
    if (type === 'child') setChildren(children + 1);
    if (type === 'infant') setInfants(infants + 1);
  };

  const decrementTraveler = (type: 'adult' | 'senior' | 'child' | 'infant') => {
    if (type === 'adult' && adults > 1) setAdults(adults - 1);
    if (type === 'senior' && seniors > 0) setSeniors(seniors - 1);
    if (type === 'child' && children > 0) setChildren(children - 1);
    if (type === 'infant' && infants > 0) setInfants(infants - 1);
  };

  const onDayPress = (day: { dateString: string }) => {
    setSelectedDate(day.dateString);
  };

  const totalPrice = selectedOption ? selectedOption.price * (adults + seniors + children + infants) : 0;

  return (
    <ImageBackground source={require('../image/background.png')} style={styles.backgroundImage}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.contentContainer}>
        <View style={styles.container}>
          <View style={styles.header}>
            <TouchableOpacity style={styles.iconButton} onPress={() => navigation.navigate('AttractionDetails', { item })}>
              <Image source={require('../image/back-icon.png')} style={styles.iconImage} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Activity</Text>
            <View style={styles.headerIcons}>
              <TouchableOpacity style={styles.iconButton} onPress={() => navigation.navigate('Cart')}>
                <Image source={require('../image/Shopping-cart.png')} style={styles.iconImage} />
              </TouchableOpacity>
            </View>
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.navbar}>
            <TouchableOpacity onPress={() => navigation.navigate('AttractionDetails', { item })}>
              <Text style={styles.Othernav}>Overview</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('PackageOption', { item })}>
              <Text style={styles.nav}>Package Option</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('ReviewsScreen', { item })}>
              <Text style={styles.Othernav}>Review</Text>
            </TouchableOpacity>
          </ScrollView>

          <View style={styles.contentContainer}>
            <Text style={styles.title}>Package Options</Text>
            {item.ticketOption.map((option: TicketOption) => (
              <View key={option.id} style={styles.ticketOptionCard}>
                <Image source={{ uri: option.image }} style={styles.ticketImage} />
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Text style={styles.ticketOptionTitle}>{option.title}</Text>
                  <TouchableOpacity style={{ flexDirection: 'row' }} onPress={() => handleSeeDetails(option)}>
                    <Text style={{ marginRight: 15, color: '#001a33', fontSize: 12, fontWeight: 'bold' }}>See Details</Text>
                    <Image source={require('../image/back-right.png')} style={styles.iconback} />
                  </TouchableOpacity>
                </View>
                <View style={{ flexDirection: 'row', marginTop: 30, alignItems: 'center', justifyContent: 'space-between' }}>
                  <Text style={styles.ticketOptionPrice}>RM {option.price.toFixed(2)}</Text>
                  <TouchableOpacity style={styles.selectButton} onPress={() => handleSelectOption(option)}>
                    <Text style={styles.selectButtonText}>Select</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      <Modal visible={isSelectModalVisible} animationType="slide" transparent={true} onRequestClose={() => setSelectModalVisible(false)} >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>

            <TouchableOpacity onPress={() => setSelectModalVisible(false)} >
              <Image source={require('../image/close.png')} style={styles.iconClose} />
            </TouchableOpacity>

            <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollViewContent}>

              <Text style={styles.selectedPackage}>
                {selectedOption ? selectedOption.title : 'None'}
              </Text>
              <Text style={styles.selectedDate}>
                Selected Date: {selectedDate ? selectedDate : 'None'}
              </Text>

              <Calendar
                onDayPress={onDayPress}
                markedDates={{
                  [selectedDate!]: { selected: true, marked: true, selectedColor: 'blue' }
                }}
                style={styles.calendar}
              />

              <Text style={styles.modalTitle}>Time</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={selectedTime}
                  style={styles.picker}
                  onValueChange={(itemValue) => setSelectedTime(itemValue)}
                >
                  <Picker.Item label="10:00 AM" value="10:00 AM" />
                  <Picker.Item label="10:30 AM" value="10:30 AM" />
                  <Picker.Item label="11:00 AM" value="11:00 AM" />
                  <Picker.Item label="11:30 AM" value="11:30 AM" />
                  <Picker.Item label="12:00 PM" value="12:00 PM" />
                </Picker>
              </View>


              <Text style={styles.modalTitle}>Travelers</Text>
              {/* Adult */}
              <View style={styles.travelerRow}>
                <Text style={styles.modalDescription}>Adult (Ages 13-59):</Text>
                <View style={styles.counter}>
                  <TouchableOpacity onPress={() => decrementTraveler('adult')}>
                    <Text style={styles.counterButton}>-</Text>
                  </TouchableOpacity>
                  <Text>{adults}</Text>
                  <TouchableOpacity onPress={() => incrementTraveler('adult')}>
                    <Text style={styles.counterButton}>+</Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Senior Citizen */}
              <View style={styles.travelerRow}>
                <Text style={styles.modalDescription}>Senior Citizen (Ages 60-99):</Text>
                <View style={styles.counter}>
                  <TouchableOpacity onPress={() => decrementTraveler('senior')}>
                    <Text style={styles.counterButton}>-</Text>
                  </TouchableOpacity>
                  <Text>{seniors}</Text>
                  <TouchableOpacity onPress={() => incrementTraveler('senior')}>
                    <Text style={styles.counterButton}>+</Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Child */}
              <View style={styles.travelerRow}>
                <Text style={styles.modalDescription}>Child (Ages 4-12):</Text>
                <View style={styles.counter}>
                  <TouchableOpacity onPress={() => decrementTraveler('child')}>
                    <Text style={styles.counterButton}>-</Text>
                  </TouchableOpacity>
                  <Text>{children}</Text>
                  <TouchableOpacity onPress={() => incrementTraveler('child')}>
                    <Text style={styles.counterButton}>+</Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Infant */}
              <View style={styles.travelerRow}>
                <Text style={styles.modalDescription}>Infants (Ages 0-3):</Text>
                <View style={styles.counter}>
                  <TouchableOpacity onPress={() => decrementTraveler('infant')}>
                    <Text style={styles.counterButton}>-</Text>
                  </TouchableOpacity>
                  <Text>{infants}</Text>
                  <TouchableOpacity onPress={() => incrementTraveler('infant')}>
                    <Text style={styles.counterButton}>+</Text>
                  </TouchableOpacity>
                </View>
              </View>

              <Text style={styles.note}>** All infants and children must be accompanied by a parent or guardian at all times.</Text>

              <View style={styles.hrLine} />

              <Text style={styles.totalPrice}>Total Price: RM {totalPrice}</Text>

              <View style={styles.buttonRow}>
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => {
                    console.log('Button pressed!');
                    handleAddToCart();
                    navigation.navigate('Cart');
                  }}
                >
                  <Text style={styles.buttonText}>Add to Cart</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.bookNowButton}
                  onPress={() => {
                    console.log('Button pressed!');
                    handleBookNow();
                  }}
                >
                  <Text style={styles.bookNowButtonText}>Book Now</Text>
                </TouchableOpacity>

              </View>
            </ScrollView>
          </View>
        </View>
      </Modal >

      <Modal
        animationType="slide"
        transparent={true}
        visible={isDetailsModalVisible}
        onRequestClose={() => setDetailsModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TouchableOpacity onPress={() => setDetailsModalVisible(false)} >
              <Image source={require('../image/close.png')} style={styles.iconClose} />
            </TouchableOpacity>
            {selectedOption && (
              <>
                <Text style={styles.description}>{selectedOption.details}</Text>

              </>
            )}
          </View>
        </View>
      </Modal>

    </ImageBackground >
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 20,
    padding: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 10,
    marginTop: 10,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#001a33',
  },
  headerIcons: {
    flexDirection: 'row',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#001a33',
  },
  ticketOptionCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginVertical: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  ticketOptionTitle: {
    fontSize: 16,
    color: '#001a33',
    fontWeight: 'bold',
    width: 230,
  },
  ticketOptionPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#001a33',
  },
  selectButton: {
    marginTop: 10,
    width: 100,
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: '#ffff',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#001a33',
    marginLeft: 100,
    alignItems: 'center',
  },
  selectButtonText: {
    color: '#001a33',
    fontWeight: 'bold',

  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'contain',
    justifyContent: 'center',
  },
  scrollView: {
    flexGrow: 1,
  },
  scrollViewContent: {
    paddingBottom: 20,
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
  iconButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 10,
    marginTop: 5,
  },
  iconImage: {
    width: 30,
    height: 30,
  },
  iconback: {
    width: 10,
    height: 10,
    marginTop: 3,
  },
  iconClose: {
    width: 10,
    height: 10,
    marginTop: 20,
    marginLeft: 255,
    marginBottom: 10,
  },
  nav: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#001a33',
  },
  Othernav: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#c4c4c4',
  },
  navbar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginTop: 10,
    gap: 80,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 30,
    color: '#001a33',
  },
  modalPrice: {
    fontSize: 16,
    color: '#ff6600',
  },
  modalDescription: {
    marginVertical: 10,
    textAlign: 'left',
    lineHeight: 30,
    width: 120,
    color: '#001a33',
  },
  description: {
    marginVertical: 10,
    textAlign: 'left',
    lineHeight: 30,
    width: 250,
    color: '#001a33',
  },
  closeButton: {
    marginTop: 15,
    padding: 10,
    backgroundColor: '#001a33',
    borderRadius: 5,
  },
  closeButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  detailsButton: {
    marginLeft: 10,
  },
  detailsButtonText: {
    color: '#007BFF',
    fontWeight: 'bold',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#001a33',
    borderRadius: 5,
    overflow: 'hidden',
    marginVertical: 10,
    width: 260,
  },
  picker: {
    height: 50,
    width: '100%',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    width: '100%',
  },
  calendar: {
    marginBottom: 20,
  },
  travelerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  counter: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 10,
  },
  counterButton: {
    fontSize: 18,
    width: 30,
    textAlign: 'center',
    backgroundColor: '#f0f0f0',
    padding: 5,
    borderRadius: 5,
    marginRight: 20,
    marginLeft: 20,
  },
  totalPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 15,
    textAlign: 'left',
    color: '#001a33',
    marginBottom: 20,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 10,
  },
  button: {
    padding: 10,
    flex: 1,
    marginHorizontal: 5,
    backgroundColor: '#001a33',
    borderRadius: 20,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 16,
  },
  bookNowButton: {
    padding: 10,
    flex: 1,
    marginHorizontal: 5,
    backgroundColor: '#fff',
    borderRadius: 20,
    borderColor: '#001a33',
    borderWidth: 1,
  },
  bookNowButtonText: {
    color: '#001a33',
    textAlign: 'center',
    fontSize: 16,
  },

  selectedDate: {
    fontSize: 16,
    marginBottom: 10,
    fontWeight: '500',
    color: '#001a33',
  },
  selectedPackage: {
    fontSize: 16,
    marginBottom: 30,
    marginTop: 10,
    fontWeight: '500',
    color: '#001a33',
  },
  note: {
    color: 'red',
    fontSize: 10,
    marginBottom: 20,
    marginTop: 20,
  },
  hrLine: {
    height: 1,
    backgroundColor: 'grey',
    marginVertical: 10,
    width: '100%',
  },
  ticketImage: {
    display: 'none',
  },

});

export default PackageOption;
