import { useState, useEffect, useCallback } from "react";

export const fetchAPI = async (url: string, options?: RequestInit) => {
  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Fetch error:", error);
    throw error;
  }
};
export const API_BASE_URL = "http://192.168.138.196:8080/api";

export const createAccount = async (user: {
  fullname: string;
  email: string;
  phone: string;
  clerkId: string | null;
}) => {
  try {
    const response = await fetchAPI(
      `${API_BASE_URL}/accounts/register?fullName=${user.fullname}&email=${user.email}&phone=${user.phone}&clerkId=${user.clerkId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      },
    );

    console.log("Account created:", response);
  } catch (error) {
    console.error("Error creating account:", error);
  }
};

export const createUser = async (user: {
  name: string;
  email: string;
  phone: string;
  clerkId: string | null;
  numCIN: string;
  imageCIN: { uri: string; name: string; type: string };
  imageProfile: { uri: string; name: string; type: string };
}) => {
  try {
    const formData = new FormData();
    formData.append("fullName", user.name);
    formData.append("email", user.email);
    formData.append("phone", user.phone);
    formData.append("clerkId", user.clerkId || "");
    formData.append("numeroCIN", user.numCIN);
    formData.append("imageCIN", {
      uri: user.imageCIN.uri,
      name: user.imageCIN.name,
      type: user.imageCIN.type,
    }as any);
    formData.append("imageProfile", {
      uri: user.imageProfile.uri,
      name: user.imageProfile.name,
      type: user.imageProfile.type,
    } as any);

    // Send the request
    const response = await fetch(`${API_BASE_URL}/users/register`, {
      method: "POST",

      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to create user");
    }

    console.log("user created:", data);
  } catch (error) {
    console.error("Error creating user:", error);
  }
};




export const useFetch = <T>(url: string, options?: RequestInit) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await fetchAPI(url, options);
      setData(result.data);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }, [url, options]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
};
