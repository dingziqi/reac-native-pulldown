import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import {
  View,
  StyleSheet,
  LayoutAnimation,
  Platform,
  UIManager,
  PanResponder,
  ActivityIndicator,
  ScrollView,
  SectionList,
  FlatList,
} from "react-native";

if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const PullDown = ({
  children,
  refreshing,
  onRefresh,
  scrollerStyle,
  maxPullHeight,
  renderRefresher,
  onRefreshThreshold,
}) => {
  const [scrollY, setScrollY] = useState(0);
  const [pulledHeight, setPulledHeight] = useState(0);

  const shouldSetPanResponder = (evt, gestureState) => {
    return scrollY === 0 && gestureState.dy > 0;
  };

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: shouldSetPanResponder,
    onMoveShouldSetPanResponder: shouldSetPanResponder,
    onPanResponderMove: (evt, gestureState) => {
      if ((pulledHeight === 0 && gestureState.dy < 0) || refreshing) return;

      const newHeight = Math.max(
        0,
        Math.min(maxPullHeight, pulledHeight + gestureState.dy)
      );
      LayoutAnimation.configureNext(
        LayoutAnimation.create(160, "linear", "opacity")
      );
      setPulledHeight(newHeight);
    },
    onPanResponderRelease: () => {
      if (pulledHeight !== 0 && !refreshing) {
        let _h = maxPullHeight;
        let resetHeight = 0;

        if (pulledHeight / maxPullHeight > onRefreshThreshold) {
          _h = maxPullHeight * onRefreshThreshold;
          resetHeight = _h;

          onRefresh();
        }

        LayoutAnimation.configureNext(
          LayoutAnimation.create(300, "easeInEaseOut", "opacity")
        );
        setPulledHeight(resetHeight);
      }
    },
  });

  const updateScrollY = (passedFn, evt) => {
    const newScrollY = evt?.nativeEvent?.contentOffset?.y;
    if (newScrollY !== undefined) {
      setScrollY(newScrollY);
    }

    passedFn && passedFn(evt);
  };

  useEffect(() => {
    if (!refreshing) {
      LayoutAnimation.configureNext(
        LayoutAnimation.create(300, "easeInEaseOut", "opacity")
      );
      setPulledHeight(0);
    }
  }, [refreshing]);

  const {
    onScroll,
    onMomentumScrollEnd,
    onTouchEnd,
    onScrollEndDrag,
  } = children.props;

  return (
    <View style={[s.container]} {...panResponder.panHandlers}>
      <View style={[s.header, { height: maxPullHeight }]}>
        {renderRefresher(pulledHeight / (maxPullHeight * onRefreshThreshold))}
      </View>
      {React.cloneElement(children, {
        style: [
          {
            marginTop: pulledHeight,
            backgroundColor: "#fff",
          },
          scrollerStyle,
        ],
        bounces: false,
        scrollEnabled: pulledHeight === 0,
        onScroll: updateScrollY.bind(null, onScroll),
        onMomentumScrollEnd: updateScrollY.bind(null, onMomentumScrollEnd),
        onTouchEnd: updateScrollY.bind(null, onTouchEnd),
        onScrollEndDrag: updateScrollY.bind(null, onScrollEndDrag),
      })}
    </View>
  );
};

PullDown.propsType = {
  maxPullHeight: PropTypes.number,
  onRefreshThreshold: PropTypes.number,
  refreshing: PropTypes.bool.isRequired,
  onRefresh: PropTypes.func.isRequired,
  renderRefresher: PropTypes.func,
  scrollerStyle: PropTypes.object,
  children: PropTypes.oneOfType([
    PropTypes.instanceOf(ScrollView),
    PropTypes.instanceOf(SectionList),
    PropTypes.instanceOf(FlatList),
  ]),
};

PullDown.defaultProps = {
  maxPullHeight: 80,
  onRefreshThreshold: 0.6,
  onRefresh: () => {},
  renderRefresher: (pullRate) => (
    <ActivityIndicator color="#000" animating={pullRate >= 1} style={s.indicator}/>
  ),
};

const s = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
  },
  indicator: {
    marginTop: 10,
    alignSelf: 'center',
  },
});

export default PullDown;
