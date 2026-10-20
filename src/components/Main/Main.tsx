import type { ReactNode } from "react";


interface MainProps {
    children: ReactNode; 
}

const Main = ({ children }: MainProps) => {
    return (
        <main className="main">
            {children} 
        </main>
    );
};

export default Main;
