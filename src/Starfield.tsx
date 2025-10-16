import React, { useRef, useEffect } from "react";

interface Star {
    x: number;
    y: number;
    z: number;
    pz: number; // position précédente
}

const Starfield: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const stars: Star[] = [];

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let width = canvas.width = window.innerWidth;
        let height = canvas.height = window.innerHeight;

        const img = new Image();
        img.src = "/src/assets/ship.png";

        // Crée les étoiles
        for (let i = 0; i < 800; i++) {
            stars.push({
                x: Math.random() * width - width / 2,
                y: Math.random() * height - height / 2,
                z: Math.random() * width,
                pz: 0
            });
        }

        const speed = 20;

        const animate = () => {
            ctx.fillStyle = "black";
            ctx.fillRect(0, 0, width, height);

            ctx.translate(width / 2, height / 2);

            for (let i = 0; i < stars.length; i++) {
                const s = stars[i];

                s.z -= speed;
                if (s.z < 1) {
                    s.x = Math.random() * width - width / 2;
                    s.y = Math.random() * height - height / 2;
                    s.z = width;
                    s.pz = s.z;
                }

                const sx = (s.x / s.z) * width;
                const sy = (s.y / s.z) * height;

                const px = (s.x / s.pz) * width;
                const py = (s.y / s.pz) * height;

                ctx.strokeStyle = "white";
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.moveTo(px, py);
                ctx.lineTo(sx, sy);
                ctx.stroke();

                s.pz = s.z;
            }

            if (img.complete) {
                const imgWidth = 100;
                const imgHeight = 75;
                ctx.drawImage(img, -imgWidth / 2, -imgHeight / 2, imgWidth, imgHeight);
            }


            ctx.setTransform(1, 0, 0, 1, 0, 0);
            requestAnimationFrame(animate);
        };

        animate();

        const handleResize = () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        };
        window.addEventListener("resize", handleResize);

        return () => window.removeEventListener("resize", handleResize);

    }, []);

    return <canvas ref={canvasRef} style={{ display: "block" }} />;
};

export default Starfield;
