<template>
    <div class="absolute inset-0 overflow-hidden">
        <canvas ref="canvasRef" class="absolute inset-0" />
    </div>
</template>
<script setup>
    import { onMounted, onUnmounted, ref } from 'vue';

    const canvasRef = ref(null);
    let animationId = 0;

    onMounted(() => {
        const canvas = canvasRef.value;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let width = window.innerWidth;
        let height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;

        const nodes = [];
        for (let i = 0; i < 60; i++) {
            nodes.push({
                x: Math.random() * width,
                y: Math.random() * height,
                vx: (Math.random() - 0.5) * 0.2,
                vy: (Math.random() - 0.5) * 0.2,
                size: Math.random() * 2 + 1,
            });
        }

        let time = 0;

        function animate() {
            time += 0.005;

            const gradient = ctx.createLinearGradient(0, 0, width, height);
            gradient.addColorStop(0, '#0a1628');
            gradient.addColorStop(0.5, '#0d1f3c');
            gradient.addColorStop(1, '#0f2847');
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, width, height);

            const orbs = [
                { x: width * 0.2, y: height * 0.3, radius: 350, color: '0, 150, 255', speed: 0.3 },
                { x: width * 0.8, y: height * 0.6, radius: 400, color: '0, 180, 255', speed: 0.4 },
                { x: width * 0.5, y: height * 0.5, radius: 500, color: '30, 144, 255', speed: 0.2 },
            ];

            orbs.forEach((orb) => {
                const x = orb.x + Math.sin(time * orb.speed) * 80;
                const y = orb.y + Math.cos(time * orb.speed * 0.7) * 50;

                const gradient = ctx.createRadialGradient(x, y, 0, x, y, orb.radius);
                gradient.addColorStop(0, `rgba(${orb.color}, 0.2)`);
                gradient.addColorStop(0.5, `rgba(${orb.color}, 0.08)`);
                gradient.addColorStop(1, `rgba(${orb.color}, 0)`);
                ctx.fillStyle = gradient;
                ctx.fillRect(0, 0, width, height);
            });

            ctx.globalAlpha = 0.04;
            ctx.strokeStyle = '#60a5fa';
            ctx.lineWidth = 1;
            const gridSize = 80;
            for (let x = 0; x < width; x += gridSize) {
                ctx.beginPath();
                ctx.moveTo(x, 0);
                ctx.lineTo(x, height);
                ctx.stroke();
            }
            for (let y = 0; y < height; y += gridSize) {
                ctx.beginPath();
                ctx.moveTo(0, y);
                ctx.lineTo(width, y);
                ctx.stroke();
            }
            ctx.globalAlpha = 1;

            for (let i = 0; i < nodes.length; i++) {
                const n = nodes[i];

                for (let j = i + 1; j < nodes.length; j++) {
                    const n2 = nodes[j];
                    const dx = n.x - n2.x;
                    const dy = n.y - n2.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < 160) {
                        const opacity = (1 - dist / 160) * 0.2;
                        ctx.strokeStyle = `rgba(96, 165, 250, ${opacity})`;
                        ctx.beginPath();
                        ctx.moveTo(n.x, n.y);
                        ctx.lineTo(n2.x, n2.y);
                        ctx.stroke();
                    }
                }

                n.x += n.vx;
                n.y += n.vy;

                if (n.x < 0 || n.x > width) n.vx *= -1;
                if (n.y < 0 || n.y > height) n.vy *= -1;

                const gradient = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, n.size * 3);
                gradient.addColorStop(0, 'rgba(147, 219, 255, 0.6)');
                gradient.addColorStop(1, 'rgba(147, 219, 255, 0)');
                ctx.fillStyle = gradient;
                ctx.beginPath();
                ctx.arc(n.x, n.y, n.size * 3, 0, Math.PI * 2);
                ctx.fill();

                ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
                ctx.beginPath();
                ctx.arc(n.x, n.y, n.size, 0, Math.PI * 2);
                ctx.fill();
            }

            animationId = requestAnimationFrame(animate);
        }

        animate();

        const handleResize = () => {
            width = window.innerWidth;
            height = window.innerHeight;
            canvas.width = width;
            canvas.height = height;
        };
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    });

    onUnmounted(() => {
        cancelAnimationFrame(animationId);
    });
</script>
