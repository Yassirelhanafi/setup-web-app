import React, { useState, useRef } from "react";
import CountryPicker, { CountryCode } from "react-native-country-picker-modal";
import PhoneInput from "react-native-phone-input";
import { StyleSheet, View, TextInput, Text } from "react-native";

const PhoneNumberInput = ({
  onChangeText,
}: {
  onChangeText: (value: string) => void;
}) => {
  const [phoneCountryCode, setPhoneCountryCode] = useState<CountryCode>("MA");
  const [showPhoneCountryPicker, setShowPhoneCountryPicker] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const phoneInput = useRef<PhoneInput>(null);

  const handleCountrySelect = (country: any) => {
    setPhoneCountryCode(country.cca2);
    const newPhoneNumber = `+${country.callingCode[0]}`;
    setPhoneNumber(newPhoneNumber);
    if (phoneInput.current) {
      phoneInput.current.selectCountry(country.cca2.toLowerCase());
      phoneInput.current.setValue(newPhoneNumber);
    }
    setShowPhoneCountryPicker(false);
  };
  const handlePhoneNumberChange = (value: string) => {
    setPhoneNumber(value);
    onChangeText(value); // Pass the phone number to the parent component
  };

  return (
    <View className="my-2 w-full">
      <Text className="text-lg font-JakartaSemiBold mb-3 ">Phone number</Text>
      <View className="flex flex-row justify-start items-center relative bg-neutral-100 rounded-full border border-neutral-100 focus:border-primary-500">
        <PhoneInput
          ref={phoneInput}
          style={styles.input}
          initialValue={phoneNumber}
          initialCountry={phoneCountryCode.toLowerCase()}
          onPressFlag={() => setShowPhoneCountryPicker(true)}
          onChangePhoneNumber={handlePhoneNumberChange}
        />
        <CountryPicker
          countryCode={phoneCountryCode}
          visible={showPhoneCountryPicker}
          onSelect={handleCountrySelect}
          onClose={() => setShowPhoneCountryPicker(false)}
          withFlagButton={false}
          withFilter
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  input: {
    borderRadius: 8,
    padding: 16,
    fontFamily: "JakartaSemiBold", // Ensure the font is correctly linked
    fontSize: 15,
    flex: 1,
    textAlign: "left",
  },
});

export default PhoneNumberInput;
