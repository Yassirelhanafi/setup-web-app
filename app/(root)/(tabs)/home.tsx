import {SignedIn, SignedOut, useAuth, useUser} from "@clerk/clerk-expo";
import {Link, router} from "expo-router";
import {Text, Image, TouchableOpacity, View, ScrollView} from "react-native";
import {icons} from "@/constants";

export default function Home() {
    const { user } = useUser();
    const { signOut } = useAuth();


    const handleSignOut = () => {
        signOut();
        router.replace("/(auth)/sign-in");
    };




    return (
        <ScrollView className="bg-white">
        <View>
            <SignedIn>
                <Text>Hello {user?.emailAddresses[0].emailAddress}</Text>
                <TouchableOpacity
                    onPress={handleSignOut}
                    className="justify-center items-center w-10 h-10 rounded-full bg-white"
                >
                    <Image source={icons.out} className="w-4 h-4" />
                </TouchableOpacity>


            </SignedIn>
            <SignedOut>
                <Link href="/sign-in">
                    <Text>Sign In</Text>
                </Link>
                <Link href="/sign-up">
                    <Text>Sign Up</Text>
                </Link>
            </SignedOut>
        </View>
        </ScrollView>
    );
}
