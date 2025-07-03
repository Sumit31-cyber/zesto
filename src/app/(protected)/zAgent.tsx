import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ActivityIndicator,
  ListRenderItem,
  Alert,
} from "react-native";
import React, { useEffect, useState, useRef, useCallback } from "react";
import CustomHeader, { headerHeight } from "components/CustomHeader";
import Groq from "groq-sdk";
import {
  getUserInformation,
  getRestaurants,
  getRestaurantDetail,
  searchRestaurant,
  getOrderHistory,
  placeOrder,
  addAddress,
} from "utils/ApiManager";
import { useAuth } from "@clerk/clerk-react";
import { LinearGradient } from "expo-linear-gradient";
import { ImageBackground } from "expo-image";
import { BlurView } from "expo-blur";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  BORDER_WIDTH,
  COLORS,
  PADDING_HORIZONTAL,
  screenWidth,
} from "utils/constants";
import { RFValue } from "react-native-responsive-fontsize";
import { router } from "expo-router";
import { AntDesign } from "@expo/vector-icons";
import CustomText from "components/customText";
import Divider from "components/Divider";
import { SendIcon } from "lucide-react-native";
import { Restaurant } from "types/types";
import Animated, {
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
} from "react-native-reanimated";
import {
  KeyboardAwareScrollView,
  useKeyboardHandler,
} from "react-native-keyboard-controller";
import InitialAgentView from "components/InitialAgentView";
import { useSelector } from "react-redux";
import { selectCart } from "redux/slice/cartSlice";
import OpenAI from "openai";

const GROQ_API_KEY = process.env.EXPO_PUBLIC_GROQ_API_KEY;
const OPEN_AI_API_KEY = process.env.EXPO_PUBLIC_OPEN_AI_API_KEY;
const EXPO_PUBLIC_HUGGING_FACE_API_KEY =
  process.env.EXPO_PUBLIC_HUGGING_FACE_API_KEY;

// TypeScript interfaces and types
interface Message {
  id: string;
  role: "system" | "user" | "assistant" | "tool";
  content: string;
  timestamp: Date;
}

interface ToolCall {
  id: string;
  function: {
    name: string;
    arguments: string;
  };
  type: "function";
}

interface ChatMessage {
  role: "system" | "user" | "assistant" | "tool";
  content: string;
  tool_call_id?: string;
  tool_calls?: ToolCall[];
}

interface PlaceOrderArgs {
  userId: string;
  restaurantId: string;
  items: any[];
  addressId: string;
  deliveryTip: number;
  otherCharges: number;
}

interface AddAddressArgs {
  userId: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  latitude?: number;
  longitude?: number;
  addressId?: string;
}

interface GetRestaurantsArgs {
  page?: number;
  limit?: number;
}

interface GetMenuDetailsArgs {
  restaurantId: string;
}

interface SearchRestaurantArgs {
  query: string;
}

interface KeyboardEvent {
  height: number;
}

// Define the Tools array (you'll need to add this based on your API)

// Initialize Groq client
const client = new Groq({
  apiKey: GROQ_API_KEY,
});
// const client: Groq = new Groq({
//   apiKey: GROQ_API_KEY || "",
// });

const useGradualAnimation = () => {
  const height = useSharedValue(0);

  useKeyboardHandler({
    onMove: (e: KeyboardEvent) => {
      "worklet";
      height.value = e.height;
    },
    onEnd: (e: KeyboardEvent) => {
      "worklet";
      height.value = e.height;
    },
  });
  return { height };
};

const ZAgent: React.FC = () => {
  const { userId } = useAuth();
  const { top, bottom } = useSafeAreaInsets();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const flatListRef = useRef<FlatList<Message>>(null);
  const cart = useSelector(selectCart);

  const { height } = useGradualAnimation();

  const fakeView = useAnimatedStyle(() => {
    return {
      height: Math.abs(height.value) - bottom + 10,
    };
  }, []);

  // Validate required environment variables
  useEffect(() => {
    if (!GROQ_API_KEY) {
      Alert.alert("Error", "GROQ API key is not configured");
    }
  }, []);

  const executeToolCall = useCallback(
    async (toolName: string, functionArgs: any): Promise<string> => {
      try {
        let result: any = "";

        switch (toolName) {
          case "getUserInformation":
            if (!userId) {
              throw new Error("User ID is required");
            }
            result = await getUserInformation(userId);
            break;

          case "getRestaurants":
            const { page = 1, limit = 10 } = functionArgs as GetRestaurantsArgs;
            result = await getRestaurants(page, limit);
            break;

          case "cart":
            result = cart.carts;
            break;

          case "getMenuDetails":
            const { restaurantId } = functionArgs as GetMenuDetailsArgs;
            if (!restaurantId) {
              throw new Error(
                "restaurantId parameter is required for getMenuDetails"
              );
            }
            result = await getRestaurantDetail(restaurantId);
            break;

          case "searchRestaurant":
            const { query } = functionArgs as SearchRestaurantArgs;
            if (!query) {
              throw new Error(
                "query parameter is required for searchRestaurant"
              );
            }
            result = await searchRestaurant(query);
            break;

          case "getOrderHistory":
            if (!userId) {
              throw new Error("User ID is required");
            }
            result = await getOrderHistory(userId);
            break;

          case "placeOrder":
            const orderData = functionArgs as PlaceOrderArgs;
            if (!userId) {
              throw new Error("User ID is required");
            }
            // Add userId to order data if not present
            const orderWithUserId = { ...orderData, userId };
            result = await placeOrder(orderWithUserId);
            break;

          case "addAddress":
            const addressData = functionArgs as AddAddressArgs;
            if (!userId) {
              throw new Error("User ID is required");
            }
            result = await addAddress(
              userId,
              addressData.addressLine1,
              addressData.addressLine2 || "",
              addressData.state,
              addressData.city,
              addressData.postalCode,
              addressData.country,
              addressData.latitude || null,
              addressData.longitude || null,
              addressData.addressId || null
            );
            break;

          default:
            throw new Error(`Unknown function: ${toolName}`);
        }

        return typeof result === "string" ? result : JSON.stringify(result);
      } catch (error) {
        console.error(`Error calling ${toolName}:`, error);
        return JSON.stringify({
          error: `Failed to execute ${toolName}: ${
            error instanceof Error ? error.message : "Unknown error"
          }`,
        });
      }
    },
    [userId, cart]
  );

  const callAgent = useCallback(
    async (userMessage: string): Promise<void> => {
      try {
        setIsLoading(true);

        const apiMessages: ChatMessage[] = [
          {
            role: "system",
            content: Instructions,
          },
          ...messages
            .filter((msg) => msg.role !== "system")
            .map((msg) => ({
              role: msg.role,
              content: msg.content,
              ...(msg.role === "tool" && { tool_call_id: msg.id }),
            })),
          {
            role: "user",
            content: userMessage,
          },
        ];

        let conversationMessages: ChatMessage[] = [...apiMessages];
        let iterationCount = 0;
        const MAX_ITERATIONS = 10; // Prevent infinite loops

        while (iterationCount < MAX_ITERATIONS) {
          //@ts-ignore
          const response = await client.chat.completions.create({
            model: "llama-3.1-8b-instant",
            messages: conversationMessages,
            tools: Tools,
            tool_choice: "auto",
          });

          const assistantMessage = response.choices[0].message;
          conversationMessages.push(assistantMessage as ChatMessage);

          const toolCalls = assistantMessage.tool_calls;

          if (!toolCalls || toolCalls.length === 0) {
            // No more tool calls, add the final response
            setMessages((prev) => [
              {
                id: Date.now().toString(),
                role: "assistant",
                content: assistantMessage.content || "",
                timestamp: new Date(),
              },
              ...prev,
            ]);
            break;
          }

          // Process tool calls
          for (const toolCall of toolCalls) {
            const toolName = toolCall.function.name;
            let functionArgs: any = {};

            try {
              functionArgs = JSON.parse(toolCall.function.arguments || "{}");
            } catch (parseError) {
              console.error("Error parsing tool arguments:", parseError);
              functionArgs = {};
            }

            console.log(`Calling Tool: ${toolName}`, functionArgs);

            const result = await executeToolCall(toolName, functionArgs);

            conversationMessages.push({
              role: "tool",
              content: result,
              tool_call_id: toolCall.id,
            });
          }

          iterationCount++;
        }

        if (iterationCount >= MAX_ITERATIONS) {
          console.warn("Max iterations reached in agent conversation");
          setMessages((prev) => [
            {
              id: Date.now().toString(),
              role: "assistant",
              content:
                "I apologize, but I'm having trouble processing your request. Please try again.",
              timestamp: new Date(),
            },
            ...prev,
          ]);
        }
      } catch (error) {
        console.error("Error calling agent:", error);
        setMessages((prev) => [
          {
            id: Date.now().toString(),
            role: "assistant",
            content: "Sorry, I encountered an error. Please try again.",
            timestamp: new Date(),
          },
          ...prev,
        ]);
      } finally {
        setIsLoading(false);
      }
    },
    [messages, executeToolCall]
  );

  const sendMessage = useCallback(async (): Promise<void> => {
    if (!inputText.trim() || isLoading) return;

    const userMessage = inputText.trim();
    setInputText("");

    const newUserMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: userMessage,
      timestamp: new Date(),
    };

    setMessages((prev) => [newUserMessage, ...prev]);
    await callAgent(userMessage);
  }, [inputText, isLoading, callAgent]);

  const renderMessage: ListRenderItem<Message> = useCallback(({ item }) => {
    const isUser = item.role === "user";

    return (
      <View
        style={[
          styles.messageContainer,
          {
            alignItems: isUser ? "flex-end" : "flex-start",
          },
        ]}
      >
        <View
          style={[
            styles.messageBubble,
            {
              backgroundColor: isUser ? COLORS.primary : COLORS.liteGray,
              borderBottomRightRadius: isUser ? 3 : 15,
              borderBottomLeftRadius: isUser ? 15 : 3,
            },
          ]}
        >
          <CustomText
            variant="h6"
            style={[
              styles.messageText,
              {
                color: isUser ? "white" : "black",
              },
            ]}
          >
            {item.content}
          </CustomText>
        </View>
        <CustomText variant="h7" style={styles.timestampText}>
          {item.timestamp.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </CustomText>
      </View>
    );
  }, []);

  const keyExtractor = useCallback((item: Message) => item.id, []);

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity
            activeOpacity={0.6}
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <AntDesign name="arrowleft" size={RFValue(16)} color="black" />
          </TouchableOpacity>
          <CustomText
            variant="h5"
            fontFamily="gilroySemiBold"
            style={styles.headerTitle}
          >
            Z Agent
          </CustomText>
          <View style={styles.loadingContainer}>
            {isLoading && (
              <ActivityIndicator size="small" color={COLORS.primary} />
            )}
          </View>
        </View>

        <View style={styles.content}>
          {messages.length === 0 ? (
            <InitialAgentView />
          ) : (
            <FlatList
              ref={flatListRef}
              data={messages}
              renderItem={renderMessage}
              keyExtractor={keyExtractor}
              contentContainerStyle={styles.messagesList}
              inverted
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            />
          )}

          <View style={styles.inputContainer}>
            <View style={styles.textInputContainer}>
              <TextInput
                style={styles.textInput}
                placeholder="Ask me anything..."
                placeholderTextColor="#999"
                value={inputText}
                onChangeText={setInputText}
                editable={!isLoading}
                onSubmitEditing={sendMessage}
                keyboardType="default"
                returnKeyType="send"
                maxLength={500}
                // multiline
              />
            </View>
            <TouchableOpacity
              onPress={sendMessage}
              disabled={!inputText.trim() || isLoading}
              style={[
                styles.sendButton,
                {
                  backgroundColor:
                    inputText.trim() && !isLoading
                      ? COLORS.primary
                      : COLORS.primary + "60",
                },
              ]}
            >
              {isLoading ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                <SendIcon color="white" size={RFValue(16)} />
              )}
            </TouchableOpacity>
          </View>
          <Animated.View style={fakeView} />
        </View>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    backgroundColor: "white",
  },
  header: {
    height: headerHeight,
    width: "100%",
    alignItems: "center",
    paddingHorizontal: PADDING_HORIZONTAL,
    flexDirection: "row",
    gap: RFValue(8),
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5E5",
  },
  backButton: {
    aspectRatio: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    textAlign: "center",
    flex: 1,
  },
  loadingContainer: {
    height: RFValue(16),
    aspectRatio: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    flex: 1,
  },
  messagesList: {
    paddingVertical: 10,
  },
  messageContainer: {
    marginVertical: 10,
    paddingHorizontal: PADDING_HORIZONTAL,
  },
  messageBubble: {
    maxWidth: screenWidth * 0.8,
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 15,
  },
  messageText: {
    lineHeight: RFValue(15),
  },
  timestampText: {
    color: "#666",
    marginTop: 5,
    fontSize: RFValue(10),
  },
  inputContainer: {
    flexDirection: "row",
    marginTop: 10,
    paddingHorizontal: PADDING_HORIZONTAL,
    paddingBottom: 10,
  },
  textInputContainer: {
    flex: 1,
    borderRadius: RFValue(25),
    backgroundColor: "white",
    paddingHorizontal: PADDING_HORIZONTAL,
    justifyContent: "center",
    borderWidth: BORDER_WIDTH,
    borderColor: `${COLORS.primary}50`,
    marginRight: 10,
    minHeight: RFValue(40),
  },
  textInput: {
    fontSize: RFValue(10),
    color: "black",
    paddingVertical: 10,
  },
  sendButton: {
    height: RFValue(40),
    aspectRatio: 1,
    borderRadius: RFValue(20),
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "flex-end",
  },
});

export default ZAgent;

const Instructions = `
You are **Zesto**, an intelligent and friendly food delivery assistant. Your job is to help users by using specific tools available to you. Follow the rules *exactly as described below*. Never assume values or skip required steps.

=======================
🛠️ TOOL USAGE GUIDELINES
=======================

You can only use the following tools. Each has strict parameter requirements:

1. **getUserInformation()**
   - Takes **NO parameters**
   - Call this directly to retrieve user profile

2. **getRestaurants(page, limit)**
   - Takes two numbers: **page** (integer), **limit** (integer)
   - Used to list restaurants for browsing

3. **getMenuDetails(restaurantId)**
   - Takes **one string**: restaurantId (UUID)
   - Use the ID from the **getRestaurants** response
   - ❗ If no restaurant data is available, first call "getRestaurants", then pass its result’s ID

4. **searchRestaurant(query)**
   - Takes **one string**: search keyword
   - Use when the user is looking for a restaurant by name or cuisine

5. **getOrderHistory()**
   - Takes **NO parameters**
   - Use to show user’s past orders

6. **placeOrder(addressId,items,restaurantId,userId,deliveryTip,otherCharges)**
   - Takes **5 parameters**: all are required
   -Take address id from "getUserInformation" if not available in you context
   -items must exists in cart
   - Do not proceed unless you have ALL values

7. **addAddress(addressLine1, addressLine2, city, state, postalCode, country, coordinates)**
   - Takes **all components of an address**
   - Prompt user if anything is missing

8. **cart()**
   - Inside this their are all available menu items present inside cart
   - Menu Items in this cart looks something like   id: string;
     restaurantId: string;
     categoryId: string;
     name: string;
     description?: string;
     price: number;
     imageUrl: string;
     isVegetarian: boolean;
     isAvailable: boolean;
     quantity: number;
     cartPrice?: number;
     isBestSeller?: boolean;
     addons?: ItemAddon[];
   - For ordering something use this cart for getting menu item
   - If menu item not present in cart which use is asking for placing order prompt user that the item must have to exist in cart before placing order


=========================
🔍 PARAMETER RULES
=========================

- ✅ Always use "getRestaurants" FIRST to retrieve valid restaurant IDs before calling "getMenuDetails".
- ⚠️ DO NOT guess or fabricate any values or IDs.
- ❓ If required data is missing, ask the user clearly and politely.
- ✅ Ensure all parameters match the expected type exactly (e.g., no passing strings where numbers are required).

=========================
✅ USAGE EXAMPLES
=========================

- User: “Show me restaurants”
  → You: Call "getRestaurants(1, 10)"

- User: “What’s on the menu for [restaurant]?”
  → First call "getRestaurants", find the matching name, extract its ID, then call "getMenuDetails(restaurantId)"

- User: “Show my orders”
  → Call "getOrderHistory()"

- User: “What’s my profile info?”
  → Call "getUserInformation()"

=========================
💬 CONVERSATIONAL STYLE
=========================

- Always speak in a helpful, clear, and friendly tone.
- Ask clarifying questions if needed.
- Do NOT break tool usage rules under any circumstances.
- Never hallucinate or invent data not explicitly returned from a tool or provided by the user.
`;

const Tools = [
  {
    type: "function",
    function: {
      name: "getUserInformation",
      description: "Get user information",
      parameters: {
        type: "object",
        properties: {},
        required: [],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "getRestaurants",
      description: "Get list of restaurants",
      parameters: {
        type: "object",
        properties: {
          page: { type: "number", description: "Page number" },
          limit: { type: "number", description: "Number of items per page" },
        },
        required: [],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "cart",
      description: "Get current cart contents does not required any parameters",
    },
  },
  {
    type: "function",
    function: {
      name: "getMenuDetails",
      description: "Get menu details for a restaurant",
      parameters: {
        type: "object",
        properties: {
          restaurantId: { type: "string", description: "Restaurant ID" },
        },
        required: ["restaurantId"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "searchRestaurant",
      description: "Search for restaurants",
      parameters: {
        type: "object",
        properties: {
          query: { type: "string", description: "Search query" },
        },
        required: ["query"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "getOrderHistory",
      description: "Get user's order history",
      parameters: {
        type: "object",
        properties: {},
        required: [],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "placeOrder",
      description: "Place a new order",
      parameters: {
        type: "object",
        properties: {
          userId: { type: "string" },
          restaurantId: { type: "string" },
          items: { type: "array" },
          addressId: { type: "string" },
          deliveryTip: { type: "number" },
          otherCharges: { type: "number" },
        },
        required: ["userId", "restaurantId", "items", "addressId"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "addAddress",
      description: "Add a new address",
      parameters: {
        type: "object",
        properties: {
          userId: { type: "string" },
          addressLine1: { type: "string" },
          addressLine2: { type: "string" },
          city: { type: "string" },
          state: { type: "string" },
          postalCode: { type: "string" },
          country: { type: "string" },
          latitude: { type: "number" },
          longitude: { type: "number" },
          addressId: { type: "string" },
        },
        required: [
          "userId",
          "addressLine1",
          "city",
          "state",
          "postalCode",
          "country",
        ],
      },
    },
  },
];
