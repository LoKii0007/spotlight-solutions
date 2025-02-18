"use client";

import { Board, Column, Task, taskStatus } from "@/types/types";
import { generateId } from "@/utils/helpers";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialTasks: Task[] = [
  {
    id: generateId(),
    title: "Implement Authentication",
    description: "Set up user authentication using NextAuth.js",
    status: taskStatus.TODO,
    priority: "high",
    boardId: "",
    userId: "",
  },
  {
    id: generateId(),
    title: "Design Dashboard",
    description: "Create wireframes for the main dashboard",
    status: taskStatus.IN_PROGRESS,
    priority: "medium",
    boardId: "",
    userId: "",
  },
  {
    id: generateId(),
    title: "Write Documentation",
    description: "Document the API endpoints",
    status: taskStatus.DONE,
    priority: "low",
    boardId: "",
    userId: "",
  },
];

const initialColumns: Column[] = [
  { id: taskStatus.TODO, title: "To Do", tasks: [], boardId: "" },
  { id: taskStatus.IN_PROGRESS, title: "In Progress", tasks: [], boardId: "" },
  { id: taskStatus.DONE, title: "Done", tasks: [], boardId: "" },
];

const initialState: Board[] = [
  {
    id: generateId().toString(),
    title: "Board 1",
    columns: initialColumns,
    tasks: initialTasks,
    description: "This is a description",
    userId: "",
  },
];

function generateInitialState() {
  const boardId = generateId().toString();
  const Tasks: Task[] = initialTasks.map((task: Task) => ({
    ...task,
    boardId,
  }));
  return [
    {
      id: boardId,
      title: "Board 1",
      columns: initialColumns.map((column: Column) => ({
        ...column,
        boardId,
        userId: "",
      })),
      tasks: Tasks,
      description: "This is a description",
      userId: "",
    },
  ];
}

const boardSlice = createSlice({
  name: "boards",
  initialState: [] as Board[],
  reducers: {
    initializeBoards: (state, action) => {
      const {boards, columns, tasks} = action.payload

      const boardMap = new Map<string, Board>(
        boards.map((board:Board) => [board.id, { ...board, columns: [], tasks: [] }])
      );

      // Assign columns to respective boards
      columns.forEach((column:Column) => {
        const board = boardMap.get(column.boardId);
        if (board) {
          board.columns.push(column);
        }
      });

      // Assign tasks to respective boards
      tasks.forEach((task:Task) => {
        const board = boardMap.get(task.boardId);
        if (board) {
          board.tasks.push(task);
        }
      });

      // Convert map back to an array and update the state
      state.push(...Array.from(boardMap.values()))
    },

    addBoard: (state, action) => {
      state.push({
        id: action.payload.id,
        title: action.payload.title,
        columns: initialColumns.map((column: Column) => ({
          ...column,
          boardId: action.payload.id,
        })),
        tasks: [],
        description: action.payload.description,
        userId: action.payload.userId,
      });
    },

    editBoard: (state, action) => {
      const board = state.find((board) => board.id === action.payload.boardId);
      if (board) {
        board.title = action.payload.title;
      }
    },

    deleteBoard: (state, action) => {
      const board = state.find((board) => board.id === action.payload.boardId);
      if (board) {
        state.splice(state.indexOf(board), 1);
      }
    },

    addTask: (state, action) => {
      const board = state.find((board) => board.id === action.payload.boardId);
      if (board) {
        board.tasks.push(action.payload.task);
      }
    },

    updateTask: (state, action) => {
      const payload = action.payload;

      const board = state.find((board: Board) => board.id === payload.boardId);
      if (!board) return;

      const taskIndex = board.tasks.findIndex((task) => task.id === payload.taskId);
      if (taskIndex === -1) return;

      board.tasks[taskIndex] = { ...board.tasks[taskIndex], ...payload.data };
      console.log("done");
    },

    deleteTask: (state, action) => {
      const board = state.find((board) => board.id === action.payload.boardId);
      if (board) {
        board.tasks = board.tasks.filter(
          (task) => task.id !== action.payload.taskId
        );
      }
    },

    deleteColumn: (state, action) => {
      const board = state.find((board) => board.id === action.payload.boardId);
      if (board) {
        board.columns = board.columns.filter(
          (column) => column.id !== action.payload.columnId
        );
      }
    },

    addColumn: (state, action) => {
      const board = state.find((board) => board.id === action.payload.boardId);
      if (board) {
        board.columns.push(action.payload.column);
      }
    },
  }
});

export const {
  initializeBoards,
  addBoard,
  editBoard,
  deleteBoard,
  addTask,
  updateTask,
  deleteTask,
  deleteColumn,
  addColumn,
} = boardSlice.actions;

export default boardSlice.reducer;
