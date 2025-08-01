# import os

# from groq import Groq
# from dotenv import load_dotenv
 
# load_dotenv()


# client = Groq(
#     # This is the default and can be omitted
#     api_key=os.environ.get("GROQ_API_KEY"),
# )

# chat_completion = client.chat.completions.create(
#     messages=[
#         {
#             "role": "system",
#             "content": "You are a helpful assistant."
#         },
#         {
#             "role": "user",
#             "content": "Explain the importance of fast language models",
#         }
#     ],
#     model="llama-3.3-70b-versatile",
# )

# print(chat_completion.choices[0].message.content)


import os
from groq import Groq

from dotenv import load_dotenv
import re
import json
import tiktoken


# Load API key and endpoint
load_dotenv()
# openai.api_key = os.getenv("GROQ_API_KEY")
# openai.api_base = os.getenv("GROQ_API_BASE")

client = Groq(api_key=os.environ.get("GROQ_API_KEY"))


MODEL_NAME = "llama3-8b-8192"
MAX_TOKENS = 8192
RESPONSE_BUFFER = 500

# System prompt
system_prompt = """
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
- When the user says there is nothing else they need help with, end the conversation with "Thank you for reaching out", "Goodbye" or "Have a good one."
- Use short sentences as much as possible.
- Don't direct the user to visit a link not provided from the backend.
- After each response, silently output the updated conversation state as valid JSON:
{
  "intent": "ReturnOrder" | "TrackOrder" | "ReportIssue" | "ProductInquiry" | "GeneralHelp",
  "order_number": string or null,
  "items": [string] or [],
  "issue_details": string or null,
  "status": "waiting_for_user" | "in_progress" | "complete"
}
Do not explain the JSON. Just include it cleanly at the end.


"""


# JSON extractor
def extract_json_from_text(text):
    try:
        json_match = re.search(r"\{[\s\S]*?\}", text)
        if json_match:
            return json.loads(json_match.group())
    except json.JSONDecodeError:
        return None
    return None

# Token helpers
def count_tokens(messages, model=MODEL_NAME):
    encoding = tiktoken.encoding_for_model("gpt-3.5-turbo")
    num_tokens = 0
    for msg in messages:
        num_tokens += 4
        for key, value in msg.items():
            num_tokens += len(encoding.encode(value))
    return num_tokens

def truncate_messages(messages, max_tokens=MAX_TOKENS - RESPONSE_BUFFER):
    while count_tokens(messages) > max_tokens and len(messages) > 1:
        messages.pop(1)
    return messages

# Merge updated state
def update_conversation_state(old, new):
    merged = old.copy()
    for key in new:
        if new[key] not in [None, "", [], "null"]:
            merged[key] = new[key]
    return merged


# Dummy order lookup
def fetch_order_info(order_number):
    dummy_orders = {
        "88888": {
            "order_number": "88888",
            "items": ["Wireless Mouse", "USB-C Charger"],
            "status": "Shipped",
            "estimated_delivery": "2025-07-15",
            "tracking_number": "TRACK123456",
            "return_eligibility": False,
            "return_link": "www.esh/orders/8"
        },
        "77777": {
            "order_number": "77777",
            "items": ["Bluetooth Speaker", "HDMI Cable"],
            "status": "Delivered",
            "estimated_delivery": "2025-07-05",
            "tracking_number": "TRACK654321",
            "return_eligibility": True,
            "return_link": "www.esh/orders/7"
        },
        "66666": {
            "order_number": "66666",
            "items": ["Laptop Stand"],
            "status": "Processing",
            "estimated_delivery": "2025-07-20",
            "tracking_number": "TRACK112233",
            "return_eligibility": True,
            "return_link": "www.esh/orders/6"
        }
    }

    return dummy_orders.get(order_number, None)


def classify_intent(user_input):
    intent_prompt = (
        "You're an intent classifier.\n"
        "Read the user's message and choose the most likely intent:\n"
        "1. ReturnOrder\n"
        "2. TrackOrder\n"
        "3. ReportIssue\n"
        "4. ProductInquiry\n"
        "5. GeneralHelp\n"
        f"User message: '{user_input}'\n"
        "Respond only with the number."
    )

    response = client.chat.completions.create(
        model=MODEL_NAME,
        messages=[{"role": "user", "content": intent_prompt}]
    )

    result = response.choices[0].message.content.strip()
    intent_map = {
        "1": "ReturnOrder",
        "2": "TrackOrder",
        "3": "ReportIssue",
        "4": "ProductInquiry",
        "5": "GeneralHelp"
    }
    return intent_map.get(result, "GeneralHelp")


# Main GPT interaction function
def generate_and_handle_response(chat_history, user_input, conversation_state):
    updated_state = conversation_state.copy()

    # Detect if user gave order number directly
    order_number_match = re.search(r"\b\d{5,}\b", user_input)
    order_info = None

    if order_number_match:
        order_number = order_number_match.group()
        print(f"\nOrder number detected: {order_number}")
        updated_state["order_number"] = order_number

        # Fetch backend info early
        order_info = fetch_order_info(order_number)
        if not order_info:
            print("\nNo order data found for that number.")
            chat_history.append({
                "role": "user", "content": user_input
            })
            chat_history.append({
                "role": "assistant",
                "content": "I'm sorry, but I couldn't find any order with that number in our records. Please double-check and try again."
            })
            # print("Assistant: I'm sorry, but I couldn't find any order with that number in our records. Please double-check and try again.")
            return conversation_state  # no state update

        
        backend_context = ""

        if updated_state.get('intent') == "ReturnOrder":
            items = ', '.join(order_info['items'])
            order_num = order_info['order_number']
            delivery_date = order_info.get("estimated_delivery", "unknown")
            return_link = order_info.get("return_link", None)
            eligible = order_info.get("return_eligibility", True)

            if eligible and return_link:
                backend_context = (
                    f"This is a ReturnOrder for order #{order_num} containing: {items}. "
                    f"The order was delivered on {delivery_date}. "
                    f"Please direct the customer to the return link: {return_link}. "
                    f"Let them know they may request a refund or replacement."
                )
            else:
                backend_context = (
                    f"This is a ReturnOrder for order #{order_num} containing: {items}. "
                    f"The order is not eligible for return."
                )

        elif updated_state.get('intent') == "TrackOrder":
            order_num = order_info['order_number']
            status = order_info.get("status", "unknown")
            delivery = order_info.get("estimated_delivery", "unknown")
            tracking = order_info.get("tracking_number", "N/A")
            backend_context = (
                f"Please tell the customer the following info: "
                f"The order status is: {status}. "
                f"Estimated delivery is by {delivery}. "
                f"Tracking number: {tracking}."
            )
        
        elif updated_state.get('intent') == "ReportIssue":
            issue = updated_state.get("issue_details", None)
            if issue:
                backend_context = (
                    f"The user reported the following issue: \"{issue}\". "
                    f"Let them know the issue has been logged and a support agent will contact them shortly."
                )


        print("\nBackend:", backend_context)
        # Inject backend info before GPT response
        chat_history.append({"role": "system", "content": f"According to our records: {backend_context}"})

    # Append user input to chat history
    chat_history.append({"role": "user", "content": user_input})

    # Prepare messages
    messages = [{"role": "system", "content": system_prompt}] + chat_history
    messages = truncate_messages(messages)

    # Call GPT
    response = client.chat.completions.create(
        model=MODEL_NAME,
        messages=messages
    )

    full_reply = response.choices[0].message.content
    visible_reply = full_reply.split("{")[0].strip()
    chat_history.append({"role": "assistant", "content": visible_reply})
    print("\nAssistant:", visible_reply)

    # Update state
    json_data = extract_json_from_text(full_reply)
    if json_data:
        updated_state = update_conversation_state(updated_state, json_data)


    return updated_state



# ---- CLI loop ----
if __name__ == "__main__":
    print("Welcome to Virtual Customer Support! (Type 'exit' to quit)\n")
    chat_history = [{"role": "system", "content": system_prompt}]
    conversation_state = {
        "intent": None,
        "order_number": None,
        "items": [],
        "issue_details": None,
        "status": "waiting_for_user"
    }

    while True:
        user_input = input("Customer: ").strip()
        if user_input.lower() in ["exit", "quit", "stop"]:
            break

        # Step 1: Classify intent if not already known or set to GeneralHelp
        if not conversation_state["intent"] or conversation_state["intent"] == "GeneralHelp":
            detected_intent = classify_intent(user_input)
            conversation_state["intent"] = detected_intent
            print(f"Detected intent: {detected_intent}")

        # Step 2: Generate full assistant response
        conversation_state = generate_and_handle_response(chat_history, user_input, conversation_state)

