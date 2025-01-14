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

const CreditCard = () => {
    const navigation = useNavigation();
    const router = useRouter();

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

            const userId = "6759c298379dca445eb791f6"; // Remplacer par l'ID utilisateur dynamique
            const response = await fetch(`http://192.168.219.192:8080/api/users/${userId}`);

            if (!response.ok) {
                throw new Error("Échec de la récupération des données utilisateur.");
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
            console.error("Erreur de récupération des données utilisateur:", err);
            setError("Impossible de charger les données utilisateur. Veuillez réessayer.");
            setUser("Guest");
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async () => {
        if (!amount || !cardNumber || !expiryDate || !cvv) {
            Alert.alert("Erreur", "Tous les champs sont obligatoires.");
            return;
        }

        try {
            // Préparation des données à envoyer au backend
            const chargeRequest = {
                amount: parseInt(amount) /11,
                cardNumber,
                expiryDate,
                cvv
            };

            setIsLoading(true);

            const response = await axios.post('http://192.168.219.192:8080/charge', chargeRequest);

            if (response.data) {
                const { id, status, balanceTransaction } = response.data;
                Alert.alert("Succès du paiement", `Paiement réussi. ID: ${id}, Statut: ${status}`);
                // Navigation vers une autre page après le paiement réussi
                // navigation.navigate('SomePage');
            }
        } catch (error) {
            console.error("Erreur lors de l'envoi du paiement:", error);
            Alert.alert("Échec du paiement", "Une erreur est survenue lors du traitement de votre paiement. Veuillez réessayer.");
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
                        <Text style={{ fontSize: 18, fontWeight: "bold" }}>Recharger votre porte-monnaie</Text>
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

                <Text style={styles.title}>Entrez le montant</Text>
                <TextInput
                    placeholder="Minimum 50Dh"
                    value={amount}
                    onChangeText={setAmount}
                    style={styles.input}
                    keyboardType="numeric"
                />

                <Text style={styles.title}>Numéro de carte</Text>
                <TextInput
                    placeholder="Entrez le numéro de la carte"
                    value={cardNumber}
                    onChangeText={setCardNumber}
                    style={styles.input}
                    keyboardType="numeric"
                />

                <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                    <View style={{ flex: 1 }}>
                        <Text style={styles.title}>Date d'expiration</Text>
                        <TextInput
                            placeholder="MM/AA"
                            value={expiryDate}
                            onChangeText={setExpiryDate}
                            style={[styles.input]}
                            keyboardType="numeric"
                        />
                    </View>
                    <View style={{ flex: 1 }}>
                        <Text style={styles.title}>CVV</Text>
                        <TextInput
                            placeholder="3 chiffres"
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
                            {isLoading ? 'Traitement...' : 'Continuer'}
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
