import { Tabs } from "expo-router";
import { Image, ImageSourcePropType, View, StyleSheet, Text } from "react-native";
import { icons } from "@/constants";  // Assurez-vous que les icônes sont bien définies ici.

const TabIcon = ({
                     activeSource,
                     inactiveSource,
                     focused,
                     label,  // Nouveau paramètre pour le texte du label
                 }: {
    activeSource: ImageSourcePropType;
    inactiveSource: ImageSourcePropType;
    focused: boolean;
    label: string;  // Le texte du label sous l'icône
}) => (
    <View style={styles.iconContainer}>
        {focused && <View style={styles.activeIndicator} />}
        <Image
            source={focused ? activeSource : inactiveSource}
            resizeMode="contain"
            style={{ width: 30, height: 30 }}
        />
        <Text
            style={[
                styles.iconLabel,
                { color: focused ? "#3532D7" : "gray" },  // Texte bleu si activé, sinon gris
            ]}
            className="text-sm "
            ellipsizeMode="tail" // Coupe proprement si nécessaire
        >
            {label}
        </Text>
    </View>
);

export default function Layout() {
    return (
        <Tabs
            initialRouteName="home"  // L'écran initial est "home"
            screenOptions={{
                tabBarActiveTintColor: "white",  // Couleur des icônes actives
                tabBarInactiveTintColor: "gray",  // Couleur des icônes inactives
                tabBarShowLabel: false,  // Pas de texte sous les icônes
                tabBarStyle: {
                    paddingBottom: 20, // ios only
                    overflow: "hidden",
                    height: 70,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexDirection: "row",
                    position: "absolute",
                    elevation: 0, // Supprime l'ombre (Android)
                    shadowOpacity: 0, // Supprime l'ombre (iOS)
                    borderTopWidth: 0, // Supprime le trait entre la barre et la page
                },  // Styles du tabBar
            }}
        >
            <Tabs.Screen
                name="Wallet"  // Assurez-vous que ces noms correspondent aux écrans
                options={{
                    title: "Wallet",
                    headerShown: false,
                    tabBarIcon: ({ focused }) => (
                        <TabIcon
                            activeSource={icons.walletActive}  // Icône active
                            inactiveSource={icons.wallet}  // Icône inactive
                            focused={focused}
                            label="Wallet"  // Texte du label
                        />
                    ),
                }}
            />
            <Tabs.Screen
                name="home"  // L'écran "home"
                options={{
                    title: "Home",
                    headerShown: false,
                    tabBarIcon: ({ focused }) => (
                        <TabIcon
                            activeSource={icons.homeActive}
                            inactiveSource={icons.home}
                            focused={focused}
                            label="Home"  // Texte du label
                        />
                    ),
                }}
            />
            <Tabs.Screen
                name="support"  // L'écran "support"
                options={{
                    title: "Support",
                    headerShown: false,
                    tabBarIcon: ({ focused }) => (
                        <TabIcon
                            activeSource={icons.supportActive}
                            inactiveSource={icons.support}
                            focused={focused}
                            label="Support"  // Texte du label
                        />
                    ),
                }}
            />
        </Tabs>
    );
}

const styles = StyleSheet.create({
    iconContainer: {
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
    },
    iconLabel: {
        fontSize: 13,
        marginTop: 4, // Espacement entre l'icône et le label
        fontWeight: "500",
        flexWrap: "nowrap", // Empêche le texte de se couper
        textAlign: "center", // Centre le texte
    },
    activeIndicator: {
        position: "absolute",
        top: -12,
        width: 32,
        height: 32,
        borderRadius: 16,
    }
});
