// import Groq from "groq-sdk";
// import 'dotenv/config';

// 
// const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// export async function main() {
//   const chatCompletion = await getGroqChatCompletion();
//  
// }

// export async function getGroqChatCompletion() {
//   return groq.chat.completions.create({
//     messages: [
//       {
//         role: "user",
//         content: "Explain the importance of fast language models",
//       },
//     ],
//     model: "llama-3.3-70b-versatile",
//   });
// }

// main();  // <== Add this to actually run your async main function


import Groq from "groq-sdk";
import dotenv from "dotenv";
import readline from "readline";

dotenv.config();

const MODEL_NAME = "llama3-8b-8192";
const MAX_TOKENS = 8192;
const RESPONSE_BUFFER = 500;

const system_prompt = `
You are a customer service assistant.
Only respond based on the user's messages and facts passed from the backend.
When a 'According to our records:' message is included, treat it as truth and use it to guide your response.
Dont provide info about order outside the According to our records:' message provided by backend.

## General Behavior:
- Respond naturally, clearly, and briefly.
- Always assume the backend message is factual and final.

## For Return Orders:
- If the user wants to return an item but hasn't provided an order number yet, ask for it.
- After the order number is provided, wait for the backend to return order details and a return link.
- Print clearlly the return link; invite the user to visit the return link to continue return operation, 
- Explain their options:
    - They may choose to **replace the item** or **request a refund**.
    - If they request a refund, it will be initiated once the returned item is received.
    - Refunds typically take **3 to 5 business days** to process.
- After providing this info, ask if there's anything else you can help with.
- Do not continue the return conversation unless the user brings it up again.

## For Tracking Orders:
- If the user wants to track an order but hasn't provided an order number yet, ask for it.
- Once the order number is provided and backend data is injected via "According to our records:", provide the current status.
- Include estimated delivery date and tracking number if available.
- Ask if there's anything else you can help with.

## For Reporting Issues:
- If the user mentions a problem but hasn't described it yet, ask them to describe the issue clearly.
- Once they provide issue details, confirm that you've logged the issue and that support will reach out.
- Ask if there's anything else you can help with.


## Final Instruction:
- When the user says there is nothing else they need help with, end the conversation with "Goodbye" or "Have a good one."
- After each response, silently output the updated conversation state as valid JSON:
{
  "intent": "ReturnOrder" | "TrackOrder" | "ReportIssue" | "ProductInquiry" | "GeneralHelp",
  "order_number": string or null,
  "items": [string] or [],
  "issue_details": string or null,
  "status": "waiting_for_user" | "in_progress" | "complete"
}
Do not explain the JSON. Just include it cleanly at the end.
`;

// Initialize Groq client
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// Regex helper to extract JSON from text
function extractJsonFromText(text) {
  const jsonMatch = text.match(/\{[\s\S]*?\}/);
  if (!jsonMatch) return null;
  try {
    return JSON.parse(jsonMatch[0]);
  } catch {
    return null;
  }
}

// Dummy order lookup data
const dummyOrders = {
  "88888": {
    order_number: "88888",
    items: ["Wireless Mouse", "USB-C Charger"],
    status: "Shipped",
    estimated_delivery: "2025-07-15",
    tracking_number: "TRACK123456",
    return_eligibility: false,
    return_link: "www.esh/orders/8",
  },
  "77777": {
    order_number: "77777",
    items: ["Bluetooth Speaker", "HDMI Cable"],
    status: "Delivered",
    estimated_delivery: "2025-07-05",
    tracking_number: "TRACK654321",
    return_eligibility: true,
    return_link: "www.esh/orders/7",
  },
  "66666": {
    order_number: "66666",
    items: ["Laptop Stand"],
    status: "Processing",
    estimated_delivery: "2025-07-20",
    tracking_number: "TRACK112233",
    return_eligibility: true,
    return_link: "www.esh/orders/6",
  },
};

function fetchOrderInfo(orderNumber) {
  return dummyOrders[orderNumber] || null;
}

async function classifyIntent(userInput) {
  const intentPrompt = `
You're an intent classifier.
Read the user's message and choose the most likely intent:
1. ReturnOrder
2. TrackOrder
3. ReportIssue
4. ProductInquiry
5. GeneralHelp
User message: '${userInput}'
Respond only with the number.
  `.trim();

  const response = await groq.chat.completions.create({
    model: MODEL_NAME,
    messages: [{ role: "user", content: intentPrompt }],
  });

  const result = response.choices[0]?.message?.content.trim();
  const intentMap = {
    "1": "ReturnOrder",
    "2": "TrackOrder",
    "3": "ReportIssue",
    "4": "ProductInquiry",
    "5": "GeneralHelp",
  };
  return intentMap[result] || "GeneralHelp";
}

function updateConversationState(oldState, newState) {
  const merged = { ...oldState };
  for (const key in newState) {
    if (
      newState[key] !== null &&
      newState[key] !== "" &&
      !(Array.isArray(newState[key]) && newState[key].length === 0) &&
      newState[key] !== "null"
    ) {
      merged[key] = newState[key];
    }
  }
  return merged;
}

function truncateMessages(messages, maxTokens = MAX_TOKENS - RESPONSE_BUFFER) {
  // Skipping detailed token count, just keep last messages to fit approx maxTokens
  while (messages.length > 6) messages.shift();
  return messages;
}

async function generateAndHandleResponse(chatHistory, userInput, conversationState) {
  let updatedState = { ...conversationState };

  // Detect order number in input
  const orderNumberMatch = userInput.match(/\b\d{5,}\b/);
  let orderInfo = null;

  if (orderNumberMatch) {
    const orderNumber = orderNumberMatch[0];
    console.log(`\nOrder number detected: ${orderNumber}`);
    updatedState.order_number = orderNumber;

    orderInfo = fetchOrderInfo(orderNumber);
    if (!orderInfo) {
      console.log("\nNo order data found for that number.");
      chatHistory.push({ role: "user", content: userInput });
      chatHistory.push({
        role: "assistant",
        content:
          "I'm sorry, but I couldn't find any order with that number in our records. Please double-check and try again.",
      });
      return conversationState;
    }

    let backendContext = "";

    if (updatedState.intent === "ReturnOrder") {
      const items = orderInfo.items.join(", ");
      const orderNum = orderInfo.order_number;
      const deliveryDate = orderInfo.estimated_delivery || "unknown";
      const returnLink = orderInfo.return_link;
      const eligible = orderInfo.return_eligibility ?? true;

      if (eligible && returnLink) {
        backendContext = `This is a ReturnOrder for order #${orderNum} containing: ${items}. The order was delivered on ${deliveryDate}. Please direct the customer to the return link: ${returnLink}. Let them know they may request a refund or replacement.`;
      } else {
        backendContext = `This is a ReturnOrder for order #${orderNum} containing: ${items}. The order is not eligible for return.`;
      }
    } else if (updatedState.intent === "TrackOrder") {
      const orderNum = orderInfo.order_number;
      const status = orderInfo.status || "unknown";
      const delivery = orderInfo.estimated_delivery || "unknown";
      const tracking = orderInfo.tracking_number || "N/A";
      backendContext = `Please tell the customer the following info: The order status is: ${status}. Estimated delivery is by ${delivery}. Tracking number: ${tracking}.`;
    } else if (updatedState.intent === "ReportIssue") {
      const issue = updatedState.issue_details;
      if (issue) {
        backendContext = `The user reported the following issue: "${issue}". Let them know the issue has been logged and a support agent will contact them shortly.`;
      }
    }

    console.log("\nBackend says:", backendContext);
    chatHistory.push({
      role: "system",
      content: `According to our records: ${backendContext}`,
    });
  }

  chatHistory.push({ role: "user", content: userInput });

  const messages = truncateMessages([{ role: "system", content: system_prompt }, ...chatHistory]);

  const response = await groq.chat.completions.create({
    model: MODEL_NAME,
    messages,
  });

  const fullReply = response.choices[0].message.content;
  const visibleReply = fullReply.split("{")[0].trim();

  chatHistory.push({ role: "assistant", content: visibleReply });
  console.log("\nAssistant:", visibleReply);

  // Extract JSON state update from reply
  const jsonData = extractJsonFromText(fullReply);
  if (jsonData) {
    updatedState = updateConversationState(updatedState, jsonData);
  }

  console.log("updatedState: ", updatedState);
  return updatedState;
}

// CLI interaction loop
async function main() {
console.log("Welcome to Customer Support! (Type 'exit' to quit)\n");

const rl = readline.createInterface({
input: process.stdin,
output: process.stdout,
});

let chatHistory = [{ role: "system", content: system_prompt }];
let conversationState = {
intent: null,
order_number: null,
items: [],
issue_details: null,
status: "waiting_for_user",
};

const askUser = () => {
rl.question("Customer: ", async (userInput) => {
if (["exit", "quit", "stop"].includes(userInput.toLowerCase())) {
rl.close();
return;
}
  if (!conversationState.intent || conversationState.intent === "GeneralHelp") {
    const detectedIntent = await classifyIntent(userInput);
    conversationState.intent = detectedIntent;
    console.log(`Detected intent: ${detectedIntent}`);
  }

  conversationState = await generateAndHandleResponse(chatHistory, userInput, conversationState);
  askUser(); // Loop
});
};

askUser();
}

main();
