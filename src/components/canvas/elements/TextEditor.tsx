'use client';

import { Html } from "react-konva-utils";
import { RefObject, useEffect, useRef } from "react";
import Konva from "konva";

interface TextEditorProps {
  textRef: RefObject<Konva.Text | null>;
  onClose: () => void;
  onChange: (newText: string) => void;
}

export default function TextEditor(props: TextEditorProps) {
  return (
    <Html>
      <TextArea {...props} />
    </Html>
  );
}

const TextArea = ({ textRef, onClose, onChange }: TextEditorProps) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (!textareaRef.current || !textRef.current) return;

    const textarea = textareaRef.current;
    const textNode = textRef.current;
    const stage = textNode.getStage();
    if (!stage) return;

    const textPosition = textNode.absolutePosition();

    // Match styles with the text node
    textarea.value = textNode.text();
    textarea.style.position = "absolute";
    textarea.style.top = `${textPosition.y}px`;
    textarea.style.left = `${textPosition.x}px`;
    textarea.style.width = `${textNode.width() * textNode.scaleX()}px`;
    textarea.style.height = `${textNode.height() * textNode.scaleY() + 5}px`;
    textarea.style.fontSize = `${textNode.fontSize() * textNode.scaleY()}px`;
    textarea.style.border = "none";
    textarea.style.padding = "0px";
    textarea.style.margin = "0px";
    textarea.style.overflow = "hidden";
    textarea.style.background = "none";
    textarea.style.outline = "none";
    textarea.style.resize = "none";
    textarea.style.lineHeight = textNode.lineHeight().toString();
    textarea.style.fontFamily = textNode.fontFamily();
    textarea.style.transformOrigin = "left top";
    textarea.style.textAlign = textNode.align();
    textarea.style.color = textNode.fill() as string;

    const rotation = textNode.rotation();
    let transform = "";
    if (rotation) {
      transform += `rotateZ(${rotation}deg)`;
    }
    textarea.style.transform = transform;

    textarea.style.height = "auto";
    textarea.style.height = `${textarea.scrollHeight + 3}px`;

    textarea.focus();

    const handleOutsideClick = (e: MouseEvent) => {
      if (e.target !== textarea) {
        onChange(textarea.value);
        onClose();
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        onChange(textarea.value);
        onClose();
      }
      if (e.key === "Escape") {
        onClose();
      }
    };

    const handleInput = () => {
      const scale = textNode.getAbsoluteScale().x;
      textarea.style.width = `${textNode.width() * scale}px`;
      textarea.style.height = "auto";
      textarea.style.height = `${textarea.scrollHeight}px`;
    };

    textarea.addEventListener("keydown", handleKeyDown);
    textarea.addEventListener("input", handleInput);
    
    const timeoutId = setTimeout(() => {
      window.addEventListener("click", handleOutsideClick);
    });

    return () => {
      clearTimeout(timeoutId);
      textarea.removeEventListener("keydown", handleKeyDown);
      textarea.removeEventListener("input", handleInput);
      window.removeEventListener("click", handleOutsideClick);
    };
  }, [textRef, onChange, onClose]);

  return (
    <textarea
      ref={textareaRef}
      style={{
        minHeight: "1em",
        position: "absolute",
      }}
    />
  );
};
