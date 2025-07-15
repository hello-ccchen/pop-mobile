import React, {useCallback, useEffect} from 'react';
import {
  Animated,
  FlatList,
  Image,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import {Card, Text} from 'react-native-paper';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {AppStackScreenParams} from '@navigations/root-stack-navigator';
import CUSTOM_THEME_COLOR_CONFIG from '@styles/custom-theme-config';
import useStore from '@store/index';
import FuelStationInfoModal from '@components/FuelStationInfoModal';
import FuelStationMap from '@components/FuelStationMap';
import {useFuelStationModal} from '@hooks/useFuelStationModal';
import useFilteredFuelStations from '@hooks/useFilteredFuelStations';
import {FuelStation} from '@services/fuelStationService';

const EVStationListScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<AppStackScreenParams, 'EVStation'>>();
  const {selectedStation, selectStation, dismissModal} = useFuelStationModal();
  const filteredEVChargingStations = useFilteredFuelStations('ele');
  const nearestEVChargingStation = useStore(state => state.nearestFuelStation?.ev);
  const viewFuelStationOption = useStore(state => state.viewFuelStationOption);
  const currentLocation = useStore(state => state.currentLocation);
  const searchFuelStationQuery = useStore(state => state.searchFuelStationQuery);
  const setSearchStationQuery = useStore(state => state.setSearchFuelStationQuery);

  useFocusEffect(
    useCallback(() => {
      return () => {
        setSearchStationQuery('');
        dismissModal();
      };
    }, [dismissModal, setSearchStationQuery]),
  );

  useEffect(() => {
    selectStation(null);
  }, [searchFuelStationQuery]);

  const renderListItem = useCallback(
    (evStation: FuelStation) => {
      const distance = evStation.formattedDistance || 'N/A';

      const scaleAnim = new Animated.Value(1);

      const handlePressIn = () => {
        Animated.spring(scaleAnim, {
          toValue: 0.96,
          useNativeDriver: true,
          speed: 20,
        }).start();
      };

      const handlePressOut = () => {
        Animated.spring(scaleAnim, {
          toValue: 1,
          useNativeDriver: true,
          speed: 20,
        }).start();
      };

      return (
        <Animated.View style={{transform: [{scale: scaleAnim}]}}>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => selectStation(evStation)}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            style={styles.cardContainer}>
            <Card.Title
              title={evStation.stationName}
              titleVariant="titleMedium"
              titleStyle={styles.cardTitle}
              subtitle={evStation.stationAddress}
              subtitleNumberOfLines={2}
              subtitleStyle={styles.cardSubtitle}
              left={() => (
                <View style={styles.cardLeftContentContainer}>
                  <Image
                    resizeMode="center"
                    source={require('../../../assets/ev-station-marker.png')}
                    style={styles.cardLeftIcon}
                  />
                  <Text style={styles.cardLeftText}>{distance}</Text>
                </View>
              )}
            />
          </TouchableOpacity>
        </Animated.View>
      );
    },
    [selectStation],
  );

  return (
    <SafeAreaView style={styles.container}>
      {viewFuelStationOption === 'list' ? (
        <>
          <FlatList
            data={filteredEVChargingStations}
            keyExtractor={item => item.id}
            renderItem={({item}) => renderListItem(item)}
            contentContainerStyle={[
              filteredEVChargingStations.length === 0 && styles.flatListEmpty,
              styles.flatListNotEmpty, // More space at bottom
            ]}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>
                  No ev charging stations found. Try adjusting your search.
                </Text>
              </View>
            }
            getItemLayout={(_data, index) => ({length: 110, offset: 110 * index, index})}
            windowSize={10}
            initialNumToRender={7}
            removeClippedSubviews
          />
          {/* Fuel Station Info Modal */}
          <FuelStationInfoModal
            selectedStation={selectedStation}
            fuelStationDistance={selectedStation?.formattedDistance ?? ''}
            nearestFuelStation={nearestEVChargingStation}
            isVisible={!!selectedStation && filteredEVChargingStations.length > 0}
            onDismiss={dismissModal}
            onNavigate={() => {
              navigation.navigate('PurchaseFuel', {selectedStationId: selectedStation?.id});
              dismissModal();
            }}
          />
        </>
      ) : (
        <FuelStationMap
          stations={filteredEVChargingStations}
          nearestFuelStation={nearestEVChargingStation}
          currentLocation={currentLocation}
          onNavigate={(station: FuelStation | null) => {
            navigation.navigate('PurchaseFuel', {selectedStationId: station?.id});
          }}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: CUSTOM_THEME_COLOR_CONFIG.colors.background,
  },
  flatListEmpty: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  flatListNotEmpty: {
    paddingBottom: 150,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  emptyImage: {
    width: 150,
    height: 150,
    marginBottom: 15,
    opacity: 0.8,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    color: '#7D8A94',
  },
  cardContainer: {
    borderBottomWidth: 1,
    borderColor: '#D6DEE2',
    backgroundColor: 'white',
    marginHorizontal: 15,
    marginVertical: 8,
    padding: 8,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: {width: 0, height: 2},
    shadowRadius: 4,
    elevation: 3, // Shadow for Android
  },
  cardTitle: {
    fontWeight: 'bold',
    marginTop: 5,
  },
  cardSubtitle: {
    marginBottom: 5,
    color: '#6B7280',
  },
  cardLeftContentContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardLeftIcon: {
    width: 40,
    height: 40,
    marginBottom: 5,
  },
  cardLeftText: {
    fontSize: 11,
    width: 50,
    textAlign: 'center',
    color: '#1F2937',
  },
});

export default EVStationListScreen;
