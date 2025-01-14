import React, { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import {
    SafeAreaView,
    Text,
    View,
    Image,
    TouchableOpacity,
    ActivityIndicator,
    ScrollView,
    Alert,
} from "react-native";
import { icons, images } from "@/constants";
import { useNavigation } from "expo-router";
import CustomButton from "@/components/CustomButton";

const Wallet = () => {
    const navigation = useNavigation();
    const router = useRouter();

    const [user, setUser] = useState<string>("Guest");
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [solde ,setSolde] = useState<number>(0);
    const[showSolde, setShowSolde] = useState<boolean>(false);

    const voirSolde = async () => {
        setShowSolde(!showSolde);
    }

    // Fetch user data by ID
    const fetchUserById = async () => {
        try {
            setIsLoading(true);
            setError(null);

            const userId = "6759c298379dca445eb791f6"; // Replace with dynamic user ID if needed
            const response = await fetch(`http://192.168.219.192:8080/api/users/${userId}`);

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

    useEffect(() => {
        fetchUserById();
    }, []);

    return (
        <SafeAreaView className="flex-1 bg-white">
            <View className="flex-row justify-between items-center p-5">
                <Image source={images.elhouat} className="w-12 h-12 rounded-full" />
                {isLoading ? (
                    <ActivityIndicator size="small" color="#000" />
                ) : (
                    <Text className="text-xl font-bold">
                        Hello, {user}!
                    </Text>
                )}
                <TouchableOpacity>
                    <Image source={icons.notifications} className="w-6 h-6" />
                </TouchableOpacity>
            </View>

            {/* Error Message */}
            {error && (
                <View className="bg-red-100 p-3 mx-5 rounded-md">
                    <Text className="text-red-500 text-center text-sm">{error}</Text>
                </View>
            )}

            {/* Balance Section */}
            <View className="mx-5 mt-5 bg-blue-700 rounded-lg p-5 flex justify-center items-center">
                <Text className="text-white text-base">Total Balance</Text>
                <TouchableOpacity
                    className="mt-2"
                    onPress={voirSolde}
                >
                    <Text className="text-white text-2xl">
                        {showSolde ? solde : "****"}
                    </Text>
                </TouchableOpacity>

                <CustomButton
                    title="Credit Card"
                    bgVariant="danger"
                    textVariant="primary"
                    className="mt-6"
                    onPress={() => router.push("/(payment)/credit_card")}
                />
                <CustomButton
                    title="Payment on Paypal"
                    bgVariant="danger"
                    textVariant="primary"
                    className="mt-1"
                    onPress={() => router.push("/(payment)/paypal_payment")}

                />
            </View>
        </SafeAreaView>
    );
};

export default Wallet;
