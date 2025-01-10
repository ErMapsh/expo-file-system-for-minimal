import {
    View,
    Text,
    StyleSheet,
    Platform,
    useWindowDimensions,
    Dimensions,
} from 'react-native';
import React from 'react';
import Animated, { interpolate, useAnimatedStyle } from 'react-native-reanimated';
import { useDrawerProgress } from '@react-navigation/drawer';

const { width } = Dimensions.get('window')
const DrawerSceneWrapper = ({ children }: any) => {
    const progress = useDrawerProgress();
    console.log(progress.value);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [
            { perspective: 1000 },
            {
                scale: interpolate(progress.value, [0, 1], [1, 0.8], 'clamp'),
            },
            {
                rotateY: `${interpolate(progress.value, [0, 1], [0, -10], 'clamp')}deg`,
            },
            {
                translateX: interpolate(
                    progress.value,
                    [0, 1],
                    [0, 0],
                    'clamp',
                ),
            },
        ],
        borderRadius: interpolate(progress.value, [0, 1], [0, 20], 'clamp'),
        overflow: 'hidden',
    }));

    return (
        <Animated.View style={[styles.container, animatedStyle]}>
            {children}
        </Animated.View>
    );
};

export default DrawerSceneWrapper;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});