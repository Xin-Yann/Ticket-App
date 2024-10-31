import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, ImageBackground, Image } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from './ThingsToDo';
import { Alert } from 'react-native'; 

type ItemDetailsScreenProps = {
  navigation: StackNavigationProp<RootStackParamList, 'ItemDetails'>;
  route: RouteProp<RootStackParamList, 'ItemDetails'>;
};

type StarRatingProps = {
  maxStars?: number;
  rating?: number;
  onRatingChange?: (newRating: number) => void;
  starSize?: number;
};

const StarRating: React.FC<StarRatingProps> = ({
  maxStars = 5,
  rating = 0,
  onRatingChange,
  starSize = 30,
}) => {
  const [currentRating, setCurrentRating] = useState(rating);

  const handleStarPress = (index: number) => {
    setCurrentRating(index + 1);
    if (onRatingChange) {
      onRatingChange(index + 1);
    }
  };

  return (
    <View style={{ flexDirection: 'row' }}>
      {Array.from({ length: maxStars }).map((_, index) => (
        <TouchableOpacity key={index} onPress={() => handleStarPress(index)}>
          <Text style={{ fontSize: starSize, color: index < currentRating ? '#FFD700' : '#ccc' }}>
            ★
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const ReviewsScreen: React.FC<ItemDetailsScreenProps> = ({ navigation, route }) => {
  const { item } = route.params || {};
  const [comment, setComment] = useState('');
  const overallRating = 3.7;
  const [userRating, setUserRating] = useState(0);
  const [commentsList, setCommentsList] = useState<{ username: string; rating: number; text: string }[]>([]);

  const handleSendComment = () => {
    if (comment.trim() && userRating > 0) {
      setCommentsList([...commentsList, { username: 'User', rating: userRating, text: comment }]);
      setComment('');
      setUserRating(0);

      Alert.alert(
        'Success!',
        'Comment Has Posted successfully!',
        [{ text: 'OK' }],
        { cancelable: false } 
      );
    }
  };

  return (
    <ImageBackground source={require('../image/background.png')} style={styles.backgroundImage}>
      <ScrollView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.iconButton} onPress={() => navigation.navigate('AttractionDetails', { item })}>
            <Image source={require('../image/back-icon.png')} style={styles.iconImage} />
          </TouchableOpacity>
          <Text style={styles.title}>Activity</Text>
          <View style={styles.headerIcons}>
            <TouchableOpacity style={styles.iconButton} onPress={() => navigation.navigate('Cart')}>
              <Image source={require('../image/Shopping-cart.png')} style={styles.iconImage} />
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.navbar}>
        <TouchableOpacity onPress={() => navigation.navigate('AttractionDetails', {item})}>
              <Text style={styles.Othernav}>Overview</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('PackageOption', { item })}>
              <Text style={styles.Othernav}>Package Option</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('ReviewsScreen', { item })}>
              <Text style={styles.nav}>Review</Text>
            </TouchableOpacity>
        </ScrollView>

        <View style={styles.reviewSection}>
          <Text style={styles.reviewTitle}>Reviews</Text>
          <View style={styles.ratingContainer}>
            <Text style={{ color: '#FFD700', fontSize: 20 }}>
              ★
            </Text>
            <Text style={styles.ratingText}> {`${overallRating} / 5`}</Text>
          </View>

          <View style={styles.ratingContainer}>
          <Text style={styles.rateLabel}>Rate: </Text>
          <StarRating
            rating={userRating}
            maxStars={5}
            starSize={20}
            onRatingChange={setUserRating}
          />
          </View>

          {overallRating < 3.7 && (
            <Text style={styles.noRatingText}>No star rating available</Text>
          )}

          {commentsList.map((item, index) => (
            <View key={index} style={styles.reviewCard}>
              <View style={styles.reviewHeader}>
                <View style={styles.avatar}></View>
                <Text style={styles.reviewerName}>{item.username}</Text>
              </View>
              <StarRating
                rating={item.rating}
                maxStars={5}
                starSize={15}
                onRatingChange={() => { }}
              />
              <Text style={styles.reviewText}>{item.text}</Text>
            </View>
          ))}

          <View style={styles.reviewCard}>
            <View style={styles.reviewHeader}>
              <View style={styles.avatar}></View>
              <Text style={styles.reviewerName}>Belle</Text>
            </View>
            <StarRating
              rating={4}
              maxStars={5}
              starSize={15}
              onRatingChange={() => { }}
            />
            <Text style={styles.reviewText}>
              If you are a nature lover, I highly recommend this place to you! The temperature is cool up here even though it's summer time, totally comfortable!
            </Text>
          </View>

          <View style={styles.commentBox}>
            <TextInput
              placeholder="Add Comment"
              style={styles.input}
              value={comment}
              onChangeText={setComment}
            />
            <TouchableOpacity
              style={styles.sendButton}
              onPress={handleSendComment}
            >
              <Image source={require('../image/sent.png')} style={styles.sentImage} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.hrLine} />

        <View style={styles.additionalInfo}>
          <Text style={styles.additionalTitle}>Additional Info</Text>
          <Text style={styles.infoText}>{`> Wheelchair accessible\n> Public transportation options are available nearby\n> No cancellations or refunds allowed\n> Children must be accompanied by an adult\n> Travelers to take the tram train at Penang Hill Tower Station. The trip to Upper Station takes less than 5 minutes. Attractions are placed at Penang Hill Upper Station.`}</Text>
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

        <TouchableOpacity style={styles.iconButton} onPress={() => navigation.navigate('Home')}>
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
  avatar: {
    backgroundColor: '#ccc',
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  container: {
    flex: 1,
    paddingHorizontal: 15,
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
    
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#001a33',
    marginLeft: 15,
    marginBottom: 10,
    marginTop: 10,
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    marginBottom: 15,
  },
  tabText: {
    paddingVertical: 10,
    fontSize: 14,
    color: '#999',
  },
  tabSelected: {
    borderBottomWidth: 3,
    borderBottomColor: '#000',
    color: '#000',
    fontWeight: 'bold',
  },
  reviewSection: {
    padding: 20,
  },
  reviewTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#001a33',
  },
  rateLabel:{
    fontWeight:'bold',
    color:'#001a33',
    marginTop:5,
  },
  ratingText: {
    fontSize: 14,
    color: '#001a33',
    marginVertical: 5,
    fontWeight: 'bold',
  },
  noRatingText: {
    color: '#ff0000',
    marginTop: 5,
  },
  reviewCard: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginVertical: 10,
  },
  reviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  reviewerName: {
    marginLeft: 10,
    fontWeight: 'bold',
    color: '#001a33',
  },
  reviewText: {
    marginTop: 10,
    color: '#001a33',
  },
  commentBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffff',
    borderRadius: 5,
    paddingHorizontal: 10,
    marginTop: 15,
  },
  input: {
    flex: 1,
    height: 40,
  },
  sendButton: {
    padding: 5,
  },
  additionalInfo: {
    color: '#001a33',
    padding:20,
  },
  additionalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#001a33'
  },
  infoText: {
    fontSize: 14,
    color: '#001a33',
    lineHeight: 30,
  },
  iconButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 3,
    marginTop: 8,
    marginRight: 10,
  },
  iconImage: {
    width: 30,
    height: 30,
  },
  sentImage: {
    width: 20,
    height: 20,
  },
  headerIcons: {
    flexDirection: 'row',
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
  nav: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#001a33',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
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
  }
});

export default ReviewsScreen;
