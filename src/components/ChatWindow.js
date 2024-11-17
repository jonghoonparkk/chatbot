"use client";

import React, { useState } from "react";
import { Input, Button, List, Typography } from "antd";

const { TextArea } = Input;

const initialQuestions = [
  "1. 오늘 기분이 어떤지 나에게 말해줄 수 있어?",
  "2. 요즘 밤에 잠은 잘 자고 있니?",
  "3. 밥은 잘 챙겨 먹고 있어? 어떤 음식 좋아해?",
  "4. 가족이나 친구들과 대화는 자주 하는 편이야?",
  "5. 최근에 힘들었던 일이 있다면 나랑 나눠줄래?",
  "6. 스트레스를 받을 때 어떻게 풀려고 하는지 궁금해!",
  "7. 쉬는 시간에는 주로 어떤 걸 하면서 보내?",
  "8. 운동은 얼마나 자주 하고 있어?",
  "9. 네가 생각하기에 너 자신이 제일 잘한 일은 뭐야?",
  "10. 나중에 꼭 이루고 싶은 꿈이나 목표가 있어?",
];

const ChatWindow = () => {
  const [messages, setMessages] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [responses, setResponses] = useState([]);
  const [input, setInput] = useState("");

  React.useEffect(() => {
    const initialMessage = {
      role: "assistant",
      content:
        "안녕? 나는 우울한 친구들을 위한 친구, 희망이야. 먼저 10개의 질문을 통해 너의 상태를 파악하고 고민을 들어줄게!",
    };
    const firstQuestion = { role: "assistant", content: initialQuestions[0] };
    setMessages([initialMessage, firstQuestion]);
  }, []);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { role: "user", content: input };
    setMessages([...messages, userMessage]);
    setResponses([...responses, input]);
    setInput("");

    if (currentQuestionIndex + 1 < initialQuestions.length) {
      const nextQuestion = initialQuestions[currentQuestionIndex + 1];
      const botMessage = { role: "assistant", content: nextQuestion };
      setMessages((prev) => [...prev, userMessage, botMessage]);
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ responses }),
      });

      const data = await response.json();
      const botMessage = {
        role: "assistant",
        content: `고마워! 네가 이야기해 준 내용을 바탕으로 고민을 들어볼게! ${data.reply}`,
      };
      setMessages((prev) => [...prev, userMessage, botMessage]);
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "auto" }}>
      <List
        bordered
        dataSource={messages}
        renderItem={(msg) => (
          <List.Item>
            <Typography.Text strong>
              {msg.role === "user" ? "너" : "희망"}:
            </Typography.Text>{" "}
            {msg.content}
          </List.Item>
        )}
        style={{ marginBottom: "20px" }}
      />
      {currentQuestionIndex < initialQuestions.length && (
        <TextArea
          rows={2}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="답변을 입력해줘!"
          style={{ marginBottom: "10px" }}
        />
      )}
      <Button
        type="primary"
        onClick={sendMessage}
        block
        disabled={currentQuestionIndex >= initialQuestions.length}
      >
        {currentQuestionIndex < initialQuestions.length ? "다음" : "상담 시작"}
      </Button>
    </div>
  );
};

export default ChatWindow;
