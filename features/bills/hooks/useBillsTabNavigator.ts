import { useRef, useState } from 'react';
import { Dimensions, type FlatList } from 'react-native';
import { useSharedValue, withTiming } from 'react-native-reanimated';

import type { BillStatus } from '@/features/bills/types/loan-accounts';

const STATUS_TABS: BillStatus[] = ['Active', 'Closed'];

const useBillsTabNavigator = () => {
  const [selectedTab, setSelectedTab] = useState<BillStatus>('Active');

  const listRef = useRef<FlatList>(null);
  const translateX = useSharedValue(0);

  const SCREEN_WIDTH = Dimensions.get('window').width;
  const TAB_WIDTH = SCREEN_WIDTH / STATUS_TABS.length;

  const handleTabPress = (tab: BillStatus, index: number) => {
    setSelectedTab(tab);
    translateX.value = withTiming(index * TAB_WIDTH, { duration: 300 });
    listRef.current?.scrollToIndex({ index, animated: true });
  };

  const handleScroll = (event: any) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    translateX.value = offsetX / STATUS_TABS.length;
    const currentIndex = Math.round(offsetX / SCREEN_WIDTH);
    setSelectedTab(STATUS_TABS[currentIndex]);
  };

  return {
    states: {
      tabs: STATUS_TABS,
      selectedTab,
      listRef,
      translateX,
      tabWidth: TAB_WIDTH,
      screenWidth: SCREEN_WIDTH,
    },
    actions: {
      handleTabPress,
      setSelectedTab,
      handleScroll,
    },
  };
};

export default useBillsTabNavigator;
