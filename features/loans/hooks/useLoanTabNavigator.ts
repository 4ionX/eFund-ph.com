import { useRef, useState } from 'react';
import { useSharedValue, withTiming } from 'react-native-reanimated';
import type { LoanStatus } from '@/features/loans/types/loans';
import { Dimensions } from 'react-native';
// eslint-disable-next-line no-duplicate-imports
import type { FlatList } from 'react-native';

const STATUS_TABS: LoanStatus[] = [
  'Pending',
  'Rejected',
  'For Approval',
  'Approved',
  'Cancelled',
];

const useLoanTabNavigator = () => {
  const [selectedTab, setSelectedTab] = useState<LoanStatus>('Pending');
  const listRef = useRef<FlatList<any>>(null);
  const translateX = useSharedValue(0);

  const screenWidth = Dimensions.get('window').width;
  const tabWidth = screenWidth / STATUS_TABS.length;

  const handleTabPress = (tab: LoanStatus, index: number) => {
    setSelectedTab(tab);

    translateX.value = withTiming(index * tabWidth, { duration: 250 });

    listRef.current?.scrollToIndex({
      index,
      animated: true,
    });
  };

  const handleScroll = (event: any) => {
    const offsetX = event.nativeEvent.contentOffset.x;

    const currentIndex = Math.round(offsetX / screenWidth);
    setSelectedTab(STATUS_TABS[currentIndex] ?? 'Pending');

    translateX.value = offsetX;
  };

  return {
    states: {
      tabs: STATUS_TABS,
      selectedTab,
      listRef,
      translateX,
      tabWidth,
      screenWidth,
    },
    actions: {
      handleTabPress,
      handleScroll,
    },
  };
};

export default useLoanTabNavigator;
