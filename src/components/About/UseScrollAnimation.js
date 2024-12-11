import { useEffect } from "react";

 const UseScrollAnimation = () => {
    useEffect(() => {
        const handleScroll = () => {
            const elements = document.querySelectorAll(".animate-on-scroll");
            elements.forEach((element) => {
                const rect = element.getBoundingClientRect();
                if (rect.top < window.innerHeight * 0.8) {
                    element.classList.add("visible");
                }
            });
        };

        window.addEventListener("scroll", handleScroll);
        handleScroll(); // Trigger once on mount

        return () => window.removeEventListener("scroll", handleScroll);
    }, []);
};
export default UseScrollAnimation;