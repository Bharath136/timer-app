import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import tailwind from 'twrnc';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    // Update state when an error is caught
    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    // Log error details and additional information
    componentDidCatch(error, errorInfo) {
        console.error('ErrorBoundary caught an error:', error, errorInfo);

        // Integrate error tracking services if needed
        if (this.props.logError) {
            this.props.logError({ error, errorInfo });
        }
    }

    // Reset the error state to allow recovery
    handleRetry = () => {
        this.setState({ hasError: false, error: null, errorInfo: null });
    };

    render() {
        const { hasError, error } = this.state;

        if (hasError) {
            return (
                <View style={tailwind`flex-1 justify-center items-center bg-red-100 px-6`}>
                    <Text style={tailwind`text-lg font-bold text-red-600 mb-2`}>
                        Oops! Something went wrong.
                    </Text>
                    <Text style={tailwind`text-sm text-red-500 mb-4 text-center`}>
                        {error?.message || 'An unexpected error occurred. Please try again later.'}
                    </Text>
                    <TouchableOpacity
                        style={tailwind`bg-red-600 px-4 py-2 rounded-lg`}
                        onPress={this.handleRetry}
                    >
                        <Text style={tailwind`text-white text-base font-bold`}>
                            Retry
                        </Text>
                    </TouchableOpacity>
                </View>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
