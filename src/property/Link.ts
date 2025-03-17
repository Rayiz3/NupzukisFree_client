const isDev = import.meta.env.DEV;

export const links = {
    localhost: isDev ? "http://localhost:3000" : import.meta.env.VITE_CLIENT_URL,
    serverAddress: isDev ? "http://localhost:4242" : import.meta.env.VITE_SERVER_URL,
};