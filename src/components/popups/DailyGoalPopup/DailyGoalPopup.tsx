"use client";

import React, { useState, useEffect, useRef } from "react";
import styles from "./DailyGoalPopup.module.css";
import { FiPlus, FiCheck, FiTrash2, FiTarget, FiArrowUp } from "react-icons/fi";

interface Todo {
  id: string;
  text: string;
  completed: boolean;
}

interface DailyGoalPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DailyGoalPopup: React.FC<DailyGoalPopupProps> = ({ isOpen, onClose }) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [inputValue, setInputValue] = useState("");
  const popupRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem("dailyGoals");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const timer = setTimeout(() => setTodos(parsed), 0);
        return () => clearTimeout(timer);
      } catch {
        console.error("Failed to parse daily goals");
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("dailyGoals", JSON.stringify(todos));
  }, [todos]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
        const target = event.target as HTMLElement;
        if (!target.closest("#daily-goal-btn")) onClose();
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      // Focus input when opened
      setTimeout(() => inputRef.current?.focus(), 50);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, onClose]);

  const handleAddTodo = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputValue.trim()) return;
    setTodos((prev) => [
      ...prev,
      { id: crypto.randomUUID(), text: inputValue.trim(), completed: false },
    ]);
    setInputValue("");
  };

  const toggleTodo = (id: string) =>
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );

  const deleteTodo = (id: string) =>
    setTodos((prev) => prev.filter((t) => t.id !== id));

  if (!isOpen) return null;

  const completedCount = todos.filter((t) => t.completed).length;
  const total = todos.length;
  const pct = total === 0 ? 0 : Math.round((completedCount / total) * 100);

  return (
    <div className={styles.popupContainer} ref={popupRef} role="dialog" aria-label="Daily goals">

      {/* ── Header ── */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <div className={styles.headerIcon} aria-hidden="true">
            <FiTarget size={13} />
          </div>
          <h3 className={styles.title}>Daily Goals</h3>
        </div>
        <span className={styles.badge} aria-label={`${completedCount} of ${total} completed`}>
          {completedCount} / {total}
        </span>
      </div>

      {/* ── Input ── */}
      <form className={styles.inputRow} onSubmit={handleAddTodo}>
        <FiPlus size={15} className={styles.inputIcon} aria-hidden="true" />
        <input
          ref={inputRef}
          type="text"
          className={styles.input}
          placeholder="Add a goal for today…"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          aria-label="New goal"
        />
        <button
          type="submit"
          className={styles.addBtn}
          disabled={!inputValue.trim()}
          aria-label="Add goal"
        >
          <FiArrowUp size={14} />
        </button>
      </form>

      {/* ── List ── */}
      <div className={styles.list} role="list" aria-label="Goals">
        {total === 0 ? (
          <div className={styles.empty}>No goals yet. What will you crush today?</div>
        ) : (
          todos.map((todo) => (
            <div
              key={todo.id}
              className={`${styles.todoItem} ${todo.completed ? styles.completedItem : ""}`}
              role="listitem"
            >
              <button
                type="button"
                className={`${styles.checkbox} ${todo.completed ? styles.checkboxChecked : ""}`}
                onClick={() => toggleTodo(todo.id)}
                aria-label={todo.completed ? "Mark incomplete" : "Mark complete"}
              >
                {todo.completed && <FiCheck size={10} strokeWidth={3} />}
              </button>

              <span
                className={`${styles.todoText} ${todo.completed ? styles.todoTextDone : ""}`}
                onClick={() => toggleTodo(todo.id)}
              >
                {todo.text}
              </span>

              <button
                type="button"
                className={styles.deleteBtn}
                onClick={() => deleteTodo(todo.id)}
                aria-label="Delete goal"
              >
                <FiTrash2 size={13} />
              </button>
            </div>
          ))
        )}
      </div>

      {/* ── Footer progress ── */}
      <div className={styles.footer}>
        <div className={styles.progressBar} role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}>
          <div className={styles.progressFill} style={{ width: `${pct}%` }} />
        </div>
        <span className={styles.progressText}>{pct}% done</span>
      </div>
    </div>
  );
};