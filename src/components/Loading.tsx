/* eslint-disable react-native/no-inline-styles */
import React, { memo } from 'react';
import { View } from 'react-native';
import { withTheme, ActivityIndicator } from 'react-native-paper';


function Loading({ theme }: any) {
    return (
        <View
            className='flex-1 justify-center items-center bg-slate-100 dark:bg-slate-900'>
            <ActivityIndicator
                animating={true}
                size="small"
                color={theme.colors.primary}
            />
        </View>
    );
}

export default memo(withTheme(Loading));
