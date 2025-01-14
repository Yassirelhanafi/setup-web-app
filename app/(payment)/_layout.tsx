import { Stack } from "expo-router";

const Layout = () => {
    return (
        <Stack>
            <Stack.Screen name="credit_card" options={{ headerShown: false }} />
            <Stack.Screen name="paypal_payment" options={{ headerShown: false }} />
            <Stack.Screen name="sign-up" options={{ headerShown: false }} />
        </Stack>
    );
};

export default Layout;
