import React, {useCallback, useEffect} from 'react';
import {FlatList, Image, SafeAreaView, StyleSheet, TouchableOpacity, View} from 'react-native';
import {Card, Text} from 'react-native-paper';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {AppStackScreenParams} from '@navigations/root-stack-navigator';
import CUSTOM_THEME_COLOR_CONFIG from '@styles/custom-theme-config';
import useStore, {FuelStation} from '@store/index';
import FuelStationInfoModal from '@components/fuel-station-info-modal';
import {useFuelStationModal} from '@hooks/use-fuel-station-modal';
import useFilteredFuelStations from '@hooks/use-filtered-fuel-stations';

const FuelStationListScreen = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<AppStackScreenParams, 'FuelStation'>>();
  const {selectedStation, selectStation, dismissModal} = useFuelStationModal();
  const filteredStations = useFilteredFuelStations();
  const nearestFuelStation = useStore(state => state.nearestFuelStation);
  const searchFuelStationQuery = useStore(state => state.searchFuelStationQuery);
  const setSearchFuelStationQuery = useStore(state => state.setSearchFuelStationQuery);

  useFocusEffect(
    useCallback(() => {
      return () => {
        setSearchFuelStationQuery('');
        dismissModal();
      };
    }, [dismissModal, setSearchFuelStationQuery]),
  );

  useEffect(() => {
    selectStation(null);
  }, [searchFuelStationQuery]);

  const renderListItem = useCallback(
    (fuelStation: FuelStation) => {
      const distance = fuelStation.formattedDistance
        ? fuelStation.formattedDistance
        : 'Calculating...';
      return (
        <TouchableOpacity activeOpacity={0.5} onPress={() => selectStation(fuelStation)}>
          <Card.Title
            style={styles.cardContainer}
            title={fuelStation.stationName}
            titleVariant="titleMedium"
            titleStyle={styles.cardTitle}
            subtitle={fuelStation.stationAddress}
            subtitleNumberOfLines={2}
            subtitleStyle={styles.cardSubtitle}
            left={() => (
              <View style={styles.cardLeftContentContainer}>
                <Image
                  resizeMode="center"
                  source={require('../../../assets/fuel-station-marker.png')}
                  style={styles.cardLeftIcon}
                />
                <Text style={styles.cardLeftText}>{distance}</Text>
              </View>
            )}
          />
        </TouchableOpacity>
      );
    },
    [selectStation],
  );

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={filteredStations}
        keyExtractor={item => item.id}
        renderItem={({item}) => renderListItem(item)}
        contentContainerStyle={[
          filteredStations.length === 0 && styles.flatListEmpty,
          selectedStation && styles.flatListContent,
        ]}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text>No fuel stations found. Try adjusting your search.</Text>
          </View>
        }
        getItemLayout={(_data, index) => ({length: 100, offset: 100 * index, index})}
      />

      {/* Fuel Station Info Modal */}
      <FuelStationInfoModal
        selectedStation={selectedStation}
        fuelStationDistance={selectedStation?.formattedDistance ?? ''}
        nearestFuelStation={nearestFuelStation}
        isVisible={!!selectedStation}
        onDismiss={dismissModal}
        onNavigate={() => {
          navigation.navigate('PurchaseFuel', {selectedStationId: selectedStation?.id});
          dismissModal();
        }}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  flatListContent: {
    paddingBottom: 200,
  },
  flatListEmpty: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardContainer: {
    borderBottomWidth: 1,
    borderColor: '#D6DEE2',
    backgroundColor: CUSTOM_THEME_COLOR_CONFIG.colors.background,
    paddingVertical: 5,
  },
  cardTitle: {
    fontWeight: 'bold',
    marginTop: 5,
  },
  cardSubtitle: {
    marginBottom: 5,
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
  },
});

export default FuelStationListScreen;
