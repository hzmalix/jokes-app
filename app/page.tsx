"use client";

import { useEffect, useRef, useState } from "react";
import { useChat } from "ai/react";

import { topics, tones, types } from "@/config";

export default function Chat() {
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const { messages, append, isLoading } = useChat();

  const [state, setState] = useState({
    topic: "",
    tone: "",
    type: "",
    temperature: 0,
  });

  const handleChange = ({
    target: { name, value },
  }: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    setState({
      ...state,
      [name]: value,
    });
  };

  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }
  }, [messages]);

  interface OptionSelectionProps {
    name: string;
    values: {
      emoji: string;
      value: string;
    }[];
  }

  const OptionSelection: React.FC<OptionSelectionProps> = ({
    name,
    values,
  }) => {
    return (
      <div className="space-y-4 bg-opacity-25 bg-gray-700 rounded-lg p-4">
        <h3 className="text-xl font-semibold capitalize">{name}</h3>

        <div className="flex flex-wrap justify-center">
          <select
            className="p-4 m-2 bg-gray-600 rounded-lg"
            name={name}
            value={state[name as keyof typeof state]}
            onChange={handleChange}
          >
            <option value="">Select a {name}</option>
            {values.map(({ emoji, value }) => (
              <option key={value} value={value}>
                {`${emoji} ${value}`}
              </option>
            ))}
          </select>
        </div>
      </div>
    );
  };

  return (
    <main className="mx-auto w-full p-4 md:p-24 flex flex-col">
      <div className="p-4 m-4">
        <div className="flex flex-col items-center justify-center space-y-8 text-white">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold">Jokes App</h2>
            <p className="text-zinc-500 dark:text-zinc-400">
              Customize the jokes by selecting the parameters.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 items-center justify-center">
            <OptionSelection name="topic" values={topics} />

            <OptionSelection name="tone" values={tones} />

            <OptionSelection name="type" values={types} />

            <div className="lg:col-span-3 space-y-4 bg-opacity-25 bg-gray-700 rounded-lg p-4">
              <h3 className="text-xl font-semibold">Temperature</h3>

              <div className="flex flex-wrap justify-center">
                <div className="p-4 m-2 bg-opacity-25 bg-gray-600 rounded-lg">
                  <input
                    id="temperature"
                    type="range"
                    name="temperature"
                    value={state.temperature}
                    onChange={handleChange}
                    min={0}
                    max={1}
                    step={0.1}
                  />
                  <label className="ml-2" htmlFor="temperature">
                    {`🌡️ ${state.temperature}`}
                  </label>
                </div>
              </div>
            </div>
          </div>

          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
            disabled={isLoading || !state.topic || !state.tone || !state.type}
            onClick={() =>
              append({
                role: "user",
                content: `Generate a ${state.type} type joke in a ${state.tone} tone about ${state.topic} topic. Adjust the humor intensity based on temperature value ${state.temperature}, where 0 is the least intense and 1 is the most intense. Don't output your parameters selections, start with the joke only.`,
              })
            }
          >
            Generate Joke
          </button>

          <div
            hidden={
              messages.length === 0 ||
              messages[messages.length - 1]?.content.startsWith("Generate")
            }
            ref={messagesContainerRef}
            className="bg-opacity-25 bg-gray-700 rounded-lg p-4"
          >
            {messages[messages.length - 1]?.content}
          </div>

          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
            hidden={
              messages.length === 0 ||
              messages[messages.length - 1]?.content.startsWith("Generate")
            }
            disabled={isLoading}
            onClick={() =>
              append({
                role: "user",
                content: `Evaluate the following joke based on: 'funny', 'appropriate', or 'offensive'. Joke: ${
                  messages[messages.length - 1]?.content
                }`,
              })
            }
          >
            Evaluate Joke
          </button>
        </div>
      </div>
    </main>
  );
}
