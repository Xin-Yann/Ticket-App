import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ImageBackground, ScrollView } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from './ThingsToDo';

type ItemDetailsNavigationProp = StackNavigationProp<RootStackParamList, 'ItemDetails'>;
type ItemDetailsRouteProp = RouteProp<RootStackParamList, 'ItemDetails'>;

interface ItemDetailsProps {
  navigation: ItemDetailsNavigationProp;
  route: ItemDetailsRouteProp;
}

const ItemDetails: React.FC<ItemDetailsProps> = ({ navigation, route }) => {
  const { item } = route.params || {};

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
              <Image source={require('../image/back-icon.png')} style={styles.iconImage} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Activity</Text>
            <TouchableOpacity style={styles.iconButton} onPress={() => navigation.navigate('Cart')}>
              <Image source={require('../image/Shopping-cart.png')} style={styles.iconImage} />
            </TouchableOpacity>
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.navbar}>
            <TouchableOpacity onPress={() => navigation.navigate('AttractionDetails', { item })}>
              <Text style={styles.nav}>Overview</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('PackageOption', { item })}>
              <Text style={styles.Othernav}>Package Option</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('ReviewsScreen', { item })}>
              <Text style={styles.Othernav}>Review</Text>
            </TouchableOpacity>
          </ScrollView>

          <Image source={{ uri: item.image }} style={styles.image} />

          <View style={styles.detailsContainer}>
            <Text style={styles.title}>{item.title}</Text>
            <View style={styles.ratingContainer}>
              <Image source={require('../image/star-filled.png')} style={styles.iconImage} />
              <Text style={styles.rating}> {item.rating}</Text>
            </View>
            <View style={styles.infoContainer}>
              <Image source={require('../image/clock.png')} style={styles.infoIcon} />
              <Text style={styles.subtitle}> {item.rating}</Text>
            </View>
            <View style={styles.infoContainer}>
              <Image source={require('../image/mobile.png')} style={styles.infoIcon} />
              <Text style={styles.subtitle}> Mobile Ticket</Text>
            </View>
          </View>

          <View style={styles.hrLine} />

          <View style={styles.contentContainer}>
            <Text style={styles.title}>Overview</Text>
            <Text style={styles.additionalInfo}>{item.desc}</Text>
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

        <TouchableOpacity style={styles.iconButton} onPress={() => navigation.navigate('Home')}>
          <View style={{ alignItems: 'center', marginBottom: 5, }}>
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
  image: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 20,
    marginTop: 20,
  },
  detailsContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#001a33',
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
  subtitle: {
    fontSize: 14,
    marginTop: 6,
    marginLeft: 5,
    color: '#001a33',
    fontWeight: 'bold',
  },
  rating: {
    fontSize: 14,
    marginTop: 6,
    marginLeft: 5,
    color: '#001a33',
    fontWeight: 'bold',
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'contain',
    justifyContent: 'center',
  },
  scrollView: {
    flexGrow: 1,
  },
  additionalInfo: {
    fontSize: 16,
    marginTop: 10,
    color: '#001a33',
  },
  iconButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: -5,
    marginLeft: -10,
    marginTop: 5,
  },
  iconImage: {
    width: 30,
    height: 30,
  },
  headerIcons: {
    flexDirection: 'row',
  },
  hrLine: {
    height: 1,
    backgroundColor: '#ccc',
    marginVertical: 10,
    width: '100%',
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
  ratingContainer: {
    flexDirection: 'row',
    marginTop: 5,
  },
  infoContainer: {
    flexDirection: 'row',
    marginTop: 10,
  },
  infoIcon: {
    width: 20,
    height: 20,
    marginTop: 5,
    marginLeft: 8,
  },
});

export default ItemDetails;
