"use client"

import { createContext, useContext, useEffect, useState } from "react";
import { io as ClientIo } from 'socket.io-client';


export type socketContextProps = {
    socket : any | null;
    isConnected : boolean;
}

const socketContext = createContext<socketContextProps>({
    socket : null,
    isConnected : false
});

export const useSocket = () => {
    return useContext(socketContext);
}

export const SocketProvider = ({ children } : { children : React.ReactNode }) => {
    const [isConnected, setIsConnected] = useState(false);
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        const socketInstance = new (ClientIo as any)(process.env.NEXT_PUBLIC_SITE_URL!, {
            path: "/api/socket/io",
            addTrailingSlash: false,
        })

        socketInstance.on("connect", () => {
            setIsConnected(true)
        })

        socketInstance.on("disconnect", () => {
            setIsConnected(false)
        })

        setSocket(socketInstance)


        return () => {
            socketInstance.disconnect();
        }
    },[])

    return (
        <socketContext.Provider value={{ socket, isConnected }}>
            {children }
        </socketContext.Provider>
    )

}