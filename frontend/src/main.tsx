
// import './index.css'
// import App from './App.js'
// import ReactDOM from "react-dom/client";
// import { createBrowserRouter } from "react-router";
// import { RouterProvider } from "react-router/dom";
// import { ThemeProvider } from './components/theme-provider.js';

// const router = createBrowserRouter([
//   {
//     path: "/",
//     Component: App,
//   },
// ]);

// const root = document.getElementById("root");

// // Add the '!' here to assert that root is not null
// ReactDOM.createRoot(root!).render(
//   <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
//     <RouterProvider router={router} />
//   </ThemeProvider>,
// );





import "./index.css";
import App from "./App.js";
import ReactDOM from "react-dom/client";
import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router/dom";
import { ThemeProvider } from "./components/theme-provider.js";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Create React Query client
const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    path: "/",
    Component: App,
  },
]);

const root = document.getElementById("root");

ReactDOM.createRoot(root!).render(
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <RouterProvider router={router} />
    </ThemeProvider>
  </QueryClientProvider>
);

