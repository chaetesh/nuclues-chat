"use client";
import { useState, useEffect, useRef } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { motion } from "framer-motion";

function App() {
  const [text, setText] = useState("");
  const [messages, setMessages] = useState([]);
  const [isResponseLoading, setIsResponseLoading] = useState(false);
  const [streamedMessage, setStreamedMessage] = useState("");

  const messagesEndRef = useRef(null);

  const dummyResponses = [
    "# **Hello!** How can I help you today?\n\nFeel free to ask anything!",
    "Sure! **Here's some information.**",
    "**Feel free to ask anything!**",
    "Thank you for your message!",
    "**I'm here to assist you.**",
    "## **Need Assistance?**\n\nJust type your question and I'll do my best to help!",
    "### **Hello!**\n\nHow can I assist you today? If you have any questions, just ask!",
    "**Hi there!** How can I make your day better? Ask me anything!",
    "Got a question? **I'm here to help.** Just type it below!",
    "**Welcome!** Let me know if you need any help or information.",
    "Hello! **I'm your virtual assistant.** What can I do for you today?",
    "Hi! If you need any help or have any questions, just let me know!",
    "Greetings! **How can I assist you today?** Feel free to ask anything!",
    "Hello! **Need any information or assistance?** I'm here to help!",
    "Hi there! **If you have any questions or need assistance, just ask.**",
    "Welcome! **I'm here to answer your questions and assist you.** What do you need help with?",
    "Hello! **Feel free to ask me anything.** I'm here to help!",
    "Greetings! **If you have any questions or need assistance, don't hesitate to ask.**",
    "Hi! **I'm here to help with any questions or concerns you might have.**",
    "Hello! **How can I assist you today?** Just let me know your questions!",
    "Welcome! **If you need any help or have questions, just type them here.**",
    "Hi! **I'm here to provide you with any information or assistance you need.** What can I help you with?",
  ];

  const submitHandler = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    setMessages((prev) => [...prev, { text, sender: "user" }]);
    setText(""); // Clear the input

    setIsResponseLoading(true);

    // Get a random response
    const botResponse =
      dummyResponses[Math.floor(Math.random() * dummyResponses.length)];

    // Start streaming the response
    streamResponse(botResponse);
  };

  const streamResponse = (response) => {
    let index = 0;
    setStreamedMessage(response.charAt(0));

    // using setInterval to stream the response like GPT
    const intervalId = setInterval(() => {
      index++;
      setStreamedMessage((prev) => prev + response.charAt(index));

      if (index === response.length - 1) {
        clearInterval(intervalId);
        // store the messages
        setMessages((prev) => [...prev, { text: response, sender: "bot" }]);
        setIsResponseLoading(false);
      }
    }, 50);
  };

  useEffect(() => {
    // Scroll to the bottom of the messages container
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isResponseLoading]);

  return (
    <>
      <div className="">
        <section className="main">
          <div className="empty-chat-container">
            <h1>Nucleus Chat</h1>
            <h3>feel free to ask anything!</h3>
          </div>

          <div className="message-display flex flex-col space-y-4 max-w-lg mx-auto">
            {messages.map((msg, index) => (
              // used animated div from framer-motion
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }} // Start position below
                animate={{ opacity: 1, y: 0 }} // End position at the original spot
                transition={{ duration: 0.5 }}
                className={`${
                  msg.sender === "user"
                    ? "self-end text-white"
                    : "self-start text-black"
                } rounded-lg p-3 shadow-md`}
              >
                <CardContent className="p-3">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {msg.text}
                  </ReactMarkdown>
                </CardContent>
              </motion.div>
            ))}
            {isResponseLoading && (
              <motion.div
                initial={{ opacity: 0, y: 20 }} // Start position below
                animate={{ opacity: 1, y: 0 }} // End position at the original spot
                transition={{ duration: 0.5 }}
                className="self-start text-black rounded-lg p-2 shadow-md"
              >
                <CardContent className="p-3">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {streamedMessage}
                  </ReactMarkdown>
                </CardContent>
              </motion.div>
            )}
            <div ref={messagesEndRef} /> {/* For scrolling */}
          </div>

          <div className="main-bottom">
            <form onSubmit={submitHandler} className="h-12 w-full gap-3 flex items-center">
              <Input
                className="mt-2 mb-2 to-black h-full"
                placeholder="Type your message here."
                value={text}
                onChange={(e) => setText(e.target.value)}
              />
              <Button type="submit">Send</Button>
            </form>
          </div>
        </section>
      </div>
    </>
  );
}

export default App;
