import { useEffect, useState } from "react";
import { Image, StyleSheet } from "react-native";
import { Redirect } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { images } from "@/constants";
import {useAuth} from "@clerk/clerk-expo";

const Splash = () => {
    const [redirectPath, setRedirectPath] = useState(null);
    const { isSignedIn } = useAuth();

    useEffect(() => {
        const timer = setTimeout(() => {
            if (isSignedIn) {
                // @ts-ignore
                setRedirectPath("/(root)/(tabs)/home");
            } else {
                // @ts-ignore
                setRedirectPath("/(auth)/welcome");
            }
        }, 700);

        return () => clearTimeout(timer);
    }, []);

    if (redirectPath) {
        return <Redirect href={redirectPath} />;
    }

    return (
        <SafeAreaView style={styles.container}>
            <Image
                source={images.fond}
                style={styles.image}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white",
        justifyContent: "center",
        alignItems: "center",
    },
    image: {
        width: "100%",
        height: "100%",
        resizeMode: "contain",
    },
});

export default Splash;
