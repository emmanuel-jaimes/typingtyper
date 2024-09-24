import React, { useEffect, useState } from "react";

interface TextStreamFromGistProps {
  onLoadText: (text: string) => void;
}

function shuffleArray(array: string[]) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

const TextStreamFromGist: React.FC<TextStreamFromGistProps> = ({
  onLoadText,
}) => {
  useEffect(() => {
    const fetchGist = async () => {
      try {
        const response = await fetch(
          "/gist/deekayen/4148741/raw/98d35708fa344717d8eee15d11987de6c8e26d7d/1-1000.txt"
        );
        const text = await response.text();
        const words = text.split(/\s+/);
        const shuffledWords = shuffleArray(words).join(" ");
        onLoadText(shuffledWords);
      } catch (error) {
        console.error("Error fetching Gist", error);
      }
    };
    fetchGist();
  }, []); //run once component mounts

  return null;
};

export default TextStreamFromGist;
