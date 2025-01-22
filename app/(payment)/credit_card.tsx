import React, { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import {
    SafeAreaView,
    Text,
    View,
    Image,
    TouchableOpacity,
    StyleSheet,
    TextInput,
    Alert,
} from "react-native";
import { icons } from "@/constants";
import { useNavigation } from "expo-router";
import axios from "axios";
import { useStripe } from "@stripe/stripe-react-native";  // Import Stripe

const CreditCard = () => {
    const navigation = useNavigation();
    const router = useRouter();

    const { confirmPayment, initPaymentSheet } = useStripe();  // Initialize Stripe methods

    const [user, setUser] = useState<string>("Guest");
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [solde, setSolde] = useState<number>(0);
    const [showSolde, setShowSolde] = useState<boolean>(false);

    const [amount, setAmount] = useState<string>("");
    const [cardNumber, setCardNumber] = useState<string>("");
    const [expiryDate, setExpiryDate] = useState<string>("");
    const [cvv, setCvv] = useState<string>("");

    const voirSolde = async () => {
        setShowSolde(!showSolde);
    };

    const fetchUserById = async () => {
        try {
            setIsLoading(true);
            setError(null);

            const userId = "6759c298379dca445eb791f6"; // Replace with actual dynamic user ID
            const response = await fetch(`http://127.0.0.1:8080/api/users/${userId}`);

            if (!response.ok) {
                throw new Error("Failed to fetch user data.");
            }

            const data = await response.json();
            if (data?.fullName) {
                setUser(data.fullName);
                setSolde(data.solde);
            } else {
                setUser("Guest");
                setSolde(0);
            }
        } catch (err: any) {
            console.error("Error fetching user data:", err);
            setError("Unable to load user data. Please try again.");
            setUser("Guest");
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async () => {
        if (!amount || !cardNumber || !expiryDate || !cvv) {
            Alert.alert("Error", "All fields are required.");
            return;
        }

        try {
            // Prepare data to send to the backend
            const chargeRequest = {
                amount: parseInt(amount) / 11,  // Adjust amount as needed
                cardNumber,
                expiryDate,
                cvv
            };

            setIsLoading(true);

            // Make request to backend to create payment intent and ephemeral key
            const response = await axios.post('http://127.0.0.1:8080/charge', chargeRequest);

            if (response.data) {
                const { ephemeralKey, paymentIntent } = response.data;

                // Now confirm payment using ephemeral key and payment intent
                const { error, paymentIntent: confirmedPaymentIntent } = await confirmPayment(paymentIntent, {
                    paymentMethodType: 'Card',
                    // ephemeralKey: ephemeralKey.id, // Pass the ephemeral key ID here
                });

                if (error) {
                    Alert.alert("Payment Error", error.message);
                } else if (confirmedPaymentIntent) {
                    Alert.alert("Payment Success", `Payment successful. ID: ${confirmedPaymentIntent.id}`);
                    // After successful payment, you can navigate to another page
                    // navigation.navigate('SomePage');
                }
            }
        } catch (error) {
            console.error("Payment error:", error);
            Alert.alert("Payment Failed", "An error occurred during payment. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchUserById();
    }, []);

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
            <View style={{ flex: 1, padding: 20 }}>
                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                    <TouchableOpacity onPress={() => router.push("/(root)/(tabs)/Wallet")} style={{ flexDirection: "row", alignItems: "center" }}>
                        <Image source={icons.backArrow} style={{ width: 24, height: 24, marginRight: 10 }} />
                        <Text style={{ fontSize: 18, fontWeight: "bold" }}>Recharge Your Wallet</Text>
                    </TouchableOpacity>
                    <TouchableOpacity>
                        <Image source={icons.list} style={{ width: 48, height: 48 }} />
                    </TouchableOpacity>
                </View>

                <View style={{ marginBottom: 20, backgroundColor: "#1D4ED8", borderRadius: 10, padding: 20, alignItems: "center" }}>
                    <TouchableOpacity onPress={voirSolde}>
                        <Text style={{ color: "white", fontSize: 30 }}>
                            {showSolde ? `${solde} Dh` : "**** Dh"}
                        </Text>
                    </TouchableOpacity>
                </View>

                <Text style={styles.title}>Enter Amount</Text>
                <TextInput
                    placeholder="Minimum 50Dh"
                    value={amount}
                    onChangeText={setAmount}
                    style={styles.input}
                    keyboardType="numeric"
                />

                <Text style={styles.title}>Card Number</Text>
                <TextInput
                    placeholder="Enter card number"
                    value={cardNumber}
                    onChangeText={setCardNumber}
                    style={styles.input}
                    keyboardType="numeric"
                />

                <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                    <View style={{ flex: 1 }}>
                        <Text style={styles.title}>Expiration Date</Text>
                        <TextInput
                            placeholder="MM/YY"
                            value={expiryDate}
                            onChangeText={setExpiryDate}
                            style={[styles.input]}
                            keyboardType="numeric"
                        />
                    </View>
                    <View style={{ flex: 1 }}>
                        <Text style={styles.title}>CVV</Text>
                        <TextInput
                            placeholder="3 digits"
                            value={cvv}
                            onChangeText={setCvv}
                            style={[styles.input]}
                            keyboardType="numeric"
                        />
                    </View>
                </View>

                <View style={styles.container}>
                    <TouchableOpacity
                        style={{ backgroundColor: "#1D4ED8", paddingVertical: 14, borderRadius: 12, alignItems: "center", marginTop: 20 }}
                        onPress={handleSubmit}
                        disabled={isLoading}
                    >
                        <Text style={{ color: "white", fontSize: 18, fontWeight: "bold" }}>
                            {isLoading ? 'Processing...' : 'Continue'}
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    title: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 10,
    },
    input: {
        backgroundColor: "white",
        borderWidth: 1,
        borderColor: "#D1D5DB",
        borderRadius: 8,
        padding: 15,
        marginBottom: 20,
        fontSize: 16,
    },
    container: {
        flex: 1,
        justifyContent: 'flex-end',
        paddingHorizontal: 16,
    },
});

export default CreditCard;
