import React from 'react';
import { View } from 'react-native';
import tw from 'twrnc';

// Generic skeleton loader
function SkeletonLoader({ style }) {
    return <View style={[tw`bg-gray-200 rounded-md mx-3`, style]} />;
}

// Skeleton for the search bar
export function SkeletonSearchBar() {
    return <SkeletonLoader style={tw` h-12 m-3 `} />;
}

// Skeleton for category buttons
export function SkeletonCategory() {
    return <SkeletonLoader style={tw`w-20 h-10`} />;
}

// Skeleton for product card
export function SkeletonProductCard() {
    return (
        <View style={tw`mb-2`}>
            <SkeletonLoader style={tw`w-45 h-48 mb-2`} />
            <SkeletonLoader style={tw`w-32 h-4`} />
        </View>
    );
}

// Skeleton for brand icons
export function SkeletonBrand() {
    return <SkeletonLoader style={tw`w-16 h-16 rounded`} />;
}
