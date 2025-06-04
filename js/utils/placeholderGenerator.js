export class PlaceholderGenerator {
    static themes = {
        characters: {
            gradient: ['#FF6B6B', '#4ECDC4'],
            pattern: 'hexagon',
            icon: '👤',
            overlay: 'noise'
        },
        weapons: {
            gradient: ['#845EC2', '#D65DB1'],
            pattern: 'circuit',
            icon: '⚔️',
            overlay: 'dots'
        },
        gliders: {
            gradient: ['#00C9A7', '#008B74'],
            pattern: 'waves',
            icon: '🪂',
            overlay: 'lines'
        },
        emotes: {
            gradient: ['#FFC75F', '#FF9671'],
            pattern: 'circles',
            icon: '🎭',
            overlay: 'sparkles'
        },
        icons: {
            gradient: ['#4B7BE5', '#3457B2'],
            pattern: 'grid',
            icon: '🎴',
            overlay: 'grain'
        }
    };

    static generatePlaceholder(width, height, text, options = {}) {
        const {
            type = 'default',
            rarity = 'common',
            animate = false
        } = options;

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');

        // Apply theme
        const theme = this.themes[type] || this.themes.default;

        // Create gradient background
        const gradient = ctx.createLinearGradient(0, 0, width, height);
        gradient.addColorStop(0, theme.gradient[0]);
        gradient.addColorStop(1, theme.gradient[1]);
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);

        // Add pattern
        this.drawPattern(ctx, width, height, theme.pattern);

        // Draw decorative frame
        this.drawFrame(ctx, width, height, rarity);

        // Add icon with glow effect
        this.drawIconWithGlow(ctx, width, height, theme.icon);

        // Add text with shadow and highlight
        this.drawStylizedText(ctx, width, height, text);

        // Add overlay effect
        this.applyOverlay(ctx, width, height, theme.overlay);

        if (animate) {
            this.addAnimation(canvas);
        }

        return canvas.toDataURL('image/png');
    }

    static drawPattern(ctx, width, height, patternType) {
        ctx.save();
        ctx.globalAlpha = 0.1;

        switch (patternType) {
            case 'hexagon':
                this.drawHexagonPattern(ctx, width, height);
                break;
            case 'circuit':
                this.drawCircuitPattern(ctx, width, height);
                break;
            case 'waves':
                this.drawWavePattern(ctx, width, height);
                break;
            // Add more patterns...
        }

        ctx.restore();
    }

    static drawFrame(ctx, width, height, rarity) {
        const frameWidth = width * 0.05;
        const gradient = ctx.createLinearGradient(0, 0, width, height);
        
        switch (rarity) {
            case 'legendary':
                gradient.addColorStop(0, '#FFD700');
                gradient.addColorStop(0.5, '#FFA500');
                gradient.addColorStop(1, '#FFD700');
                break;
            case 'epic':
                gradient.addColorStop(0, '#FF00FF');
                gradient.addColorStop(0.5, '#800080');
                gradient.addColorStop(1, '#FF00FF');
                break;
            // Add more rarity styles...
        }

        ctx.strokeStyle = gradient;
        ctx.lineWidth = frameWidth;
        ctx.strokeRect(frameWidth/2, frameWidth/2, width - frameWidth, height - frameWidth);
    }

    static drawIconWithGlow(ctx, width, height, icon) {
        ctx.save();
        
        // Add glow effect
        ctx.shadowColor = 'rgba(255, 255, 255, 0.5)';
        ctx.shadowBlur = 20;
        
        ctx.font = `${width * 0.25}px Arial`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = 'white';
        ctx.fillText(icon, width/2, height * 0.4);
        
        ctx.restore();
    }

    static drawStylizedText(ctx, width, height, text) {
        // Text shadow
        ctx.save();
        ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
        ctx.shadowBlur = 10;
        ctx.shadowOffsetY = 2;

        // Main text
        ctx.font = `bold ${width * 0.1}px Arial`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = 'white';
        ctx.fillText(text, width/2, height * 0.7);

        // Size indicator
        ctx.font = `${width * 0.06}px Arial`;
        ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
        ctx.fillText(`${width}×${height}`, width/2, height * 0.85);

        ctx.restore();
    }

    static async createPlaceholders(type, options = {}) {
        const sizes = {
            preview: [512, 512],
            icon: [128, 128],
            thumbnail: [64, 64]
        };

        const placeholders = {};
        for (const [sizeType, [width, height]] of Object.entries(sizes)) {
            placeholders[sizeType] = this.generatePlaceholder(
                width, 
                height, 
                `${type} ${sizeType}`, 
                { type, ...options }
            );
        }

        return placeholders;
    }

    static drawHexagonPattern(ctx, width, height) {
        const size = width * 0.1;
        const h = size * Math.sqrt(3);
        const cols = Math.ceil(width / (size * 3)) + 2;
        const rows = Math.ceil(height / h) + 2;

        ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
        ctx.lineWidth = 2;

        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                const x = col * size * 3;
                const y = row * h + (col % 2) * (h / 2);
                this.drawHexagon(ctx, x, y, size);
            }
        }
    }

    static drawHexagon(ctx, x, y, size) {
        ctx.beginPath();
        for (let i = 0; i < 6; i++) {
            const angle = (Math.PI / 3) * i;
            const px = x + size * Math.cos(angle);
            const py = y + size * Math.sin(angle);
            if (i === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
        }
        ctx.closePath();
        ctx.stroke();
    }

    static drawCircuitPattern(ctx, width, height) {
        const gridSize = width * 0.05;
        const lineWidth = 2;
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
        ctx.lineWidth = lineWidth;

        for (let x = 0; x < width; x += gridSize) {
            for (let y = 0; y < height; y += gridSize) {
                if (Math.random() < 0.3) {
                    const type = Math.floor(Math.random() * 4);
                    this.drawCircuitElement(ctx, x, y, gridSize, type);
                }
            }
        }
    }

    static drawCircuitElement(ctx, x, y, size, type) {
        ctx.beginPath();
        switch (type) {
            case 0: // Straight line
                ctx.moveTo(x, y + size/2);
                ctx.lineTo(x + size, y + size/2);
                break;
            case 1: // Corner
                ctx.moveTo(x + size/2, y);
                ctx.lineTo(x + size/2, y + size/2);
                ctx.lineTo(x + size, y + size/2);
                break;
            case 2: // T-junction
                ctx.moveTo(x + size/2, y);
                ctx.lineTo(x + size/2, y + size);
                ctx.moveTo(x + size/2, y + size/2);
                ctx.lineTo(x + size, y + size/2);
                break;
            case 3: // Node
                ctx.arc(x + size/2, y + size/2, size/4, 0, Math.PI * 2);
        }
        ctx.stroke();
    }

    static drawWavePattern(ctx, width, height) {
        const amplitude = height * 0.05;
        const frequency = width * 0.01;
        const layers = 3;

        for (let layer = 0; layer < layers; layer++) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(255, 255, 255, ${0.1 - layer * 0.02})`;
            
            for (let x = 0; x < width; x += 2) {
                const y = height/2 + 
                    Math.sin(x * frequency * 0.01 + layer) * amplitude + 
                    layer * amplitude * 2;
                
                if (x === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            }
            ctx.stroke();
        }
    }

    static addAnimation(canvas) {
        let frame = 0;
        const animate = () => {
            frame++;
            const ctx = canvas.getContext('2d');
            
            // Apply shimmer effect
            const shimmer = ctx.createLinearGradient(
                0, 0,
                canvas.width, canvas.height
            );
            
            const phase = (Math.sin(frame * 0.05) + 1) / 2;
            
            shimmer.addColorStop(0, 'rgba(255, 255, 255, 0)');
            shimmer.addColorStop(phase, 'rgba(255, 255, 255, 0.1)');
            shimmer.addColorStop(1, 'rgba(255, 255, 255, 0)');
            
            ctx.fillStyle = shimmer;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            requestAnimationFrame(animate);
        };
        
        animate();
    }

    static applyOverlay(ctx, width, height, overlayType) {
        ctx.save();
        switch (overlayType) {
            case 'noise':
                this.applyNoiseOverlay(ctx, width, height);
                break;
            case 'dots':
                this.applyDotsOverlay(ctx, width, height);
                break;
            case 'grain':
                this.applyGrainOverlay(ctx, width, height);
                break;
            case 'sparkles':
                this.applySparklesOverlay(ctx, width, height);
                break;
        }
        ctx.restore();
    }

    static applyNoiseOverlay(ctx, width, height) {
        const imageData = ctx.getImageData(0, 0, width, height);
        const data = imageData.data;
        
        for (let i = 0; i < data.length; i += 4) {
            const noise = Math.random() * 20 - 10;
            data[i] = Math.min(255, Math.max(0, data[i] + noise));
            data[i + 1] = Math.min(255, Math.max(0, data[i + 1] + noise));
            data[i + 2] = Math.min(255, Math.max(0, data[i + 2] + noise));
        }
        
        ctx.putImageData(imageData, 0, 0);
    }

    static applyDotsOverlay(ctx, width, height) {
        const dotSize = Math.max(1, width * 0.005);
        const spacing = dotSize * 4;
        
        ctx.save();
        ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
        
        // Create dot pattern with varying sizes and opacity
        for (let x = 0; x < width; x += spacing) {
            for (let y = 0; y < height; y += spacing) {
                if (Math.random() > 0.5) {
                    const randomSize = dotSize * (0.5 + Math.random());
                    const opacity = 0.05 + Math.random() * 0.1;
                    
                    ctx.beginPath();
                    ctx.globalAlpha = opacity;
                    ctx.arc(
                        x + (Math.random() - 0.5) * spacing * 0.5,
                        y + (Math.random() - 0.5) * spacing * 0.5,
                        randomSize,
                        0,
                        Math.PI * 2
                    );
                    ctx.fill();
                }
            }
        }
        ctx.restore();
    }

    static applyGrainOverlay(ctx, width, height) {
        const grainSize = 1;
        const intensity = 0.15;
        
        ctx.save();
        ctx.globalCompositeOperation = 'overlay';
        
        // Create fine grain texture
        const imageData = ctx.createImageData(width, height);
        const data = imageData.data;
        
        for (let i = 0; i < data.length; i += 4) {
            const noise = Math.random() * 255;
            const alpha = Math.random() * intensity * 255;
            data[i] = noise;
            data[i + 1] = noise;
            data[i + 2] = noise;
            data[i + 3] = alpha;
        }
        
        ctx.putImageData(imageData, 0, 0);
        
        // Add subtle noise pattern
        for (let i = 0; i < width * height * 0.1; i++) {
            const x = Math.random() * width;
            const y = Math.random() * height;
            const brightness = Math.random() * 0.3;
            
            ctx.fillStyle = `rgba(255, 255, 255, ${brightness})`;
            ctx.fillRect(x, y, grainSize, grainSize);
        }
        
        ctx.restore();
    }

    static applySparklesOverlay(ctx, width, height) {
        const numSparkles = Math.floor((width * height) / 8000);
        
        ctx.save();
        ctx.globalCompositeOperation = 'screen';
        
        // Create multiple layers of sparkles
        for (let layer = 0; layer < 3; layer++) {
            const layerOpacity = 0.8 - layer * 0.2;
            const layerSize = (3 - layer) * (width * 0.015);
            
            for (let i = 0; i < numSparkles; i++) {
                const x = Math.random() * width;
                const y = Math.random() * height;
                const size = (Math.random() * layerSize) + 1;
                
                // Inner glow
                const innerGlow = ctx.createRadialGradient(
                    x, y, 0,
                    x, y, size
                );
                
                innerGlow.addColorStop(0, `rgba(255, 255, 255, ${layerOpacity})`);
                innerGlow.addColorStop(0.1, `rgba(255, 255, 255, ${layerOpacity * 0.5})`);
                innerGlow.addColorStop(1, 'rgba(255, 255, 255, 0)');
                
                ctx.fillStyle = innerGlow;
                ctx.fillRect(x - size, y - size, size * 2, size * 2);
                
                // Sparkle cross
                if (Math.random() > 0.7) {
                    ctx.strokeStyle = `rgba(255, 255, 255, ${layerOpacity * 0.5})`;
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(x - size, y);
                    ctx.lineTo(x + size, y);
                    ctx.moveTo(x, y - size);
                    ctx.lineTo(x, y + size);
                    ctx.stroke();
                }
            }
        }
        
        ctx.restore();
    }

    static applyLinesOverlay(ctx, width, height) {
        ctx.save();
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
        ctx.lineWidth = 1;
        
        // Create diagonal line pattern
        const spacing = width * 0.02;
        const angle = Math.PI / 4;
        const cos = Math.cos(angle);
        const sin = Math.sin(angle);
        
        for (let i = 0; i < width + height; i += spacing) {
            const x1 = i * cos;
            const y1 = i * sin;
            
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x1 - height * sin, y1 + height * cos);
            ctx.stroke();
        }
        
        ctx.restore();
    }

    static saveToFile(canvas, filename) {
        return new Promise((resolve, reject) => {
            try {
                // Convert canvas to blob
                canvas.toBlob(blob => {
                    // Create a download link
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = filename;
                    
                    // Trigger download
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    
                    // Cleanup
                    URL.revokeObjectURL(url);
                    resolve();
                }, 'image/png');
            } catch (error) {
                reject(error);
            }
        });
    }

    // Example usage
    static async generateAndSave(type, options = {}) {
        const placeholders = await this.createPlaceholders(type, options);
        
        for (const [size, dataUrl] of Object.entries(placeholders)) {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            const img = new Image();
            
            await new Promise((resolve, reject) => {
                img.onload = resolve;
                img.onerror = reject;
                img.src = dataUrl;
            });
            
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);
            
            await this.saveToFile(canvas, `${type}_${size}.png`);
        }
    }

    static applyAdvancedEffects(ctx, width, height, options = {}) {
        const {
            type = 'default',
            rarity = 'common',
            quality = 'high'
        } = options;

        // Apply chromatic aberration
        if (quality === 'high') {
            this.applyChromaticAberration(ctx, width, height, rarity);
        }

        // Add rarity-specific glow
        this.applyRarityGlow(ctx, width, height, rarity);

        // Apply vignette effect
        this.applyVignette(ctx, width, height, 0.3);

        // Add animated particles if type-specific
        if (type === 'legendary' || type === 'epic') {
            this.addParticleSystem(ctx, width, height, type);
        }
    }

    static applyChromaticAberration(ctx, width, height, intensity = 2) {
        const imageData = ctx.getImageData(0, 0, width, height);
        const data = imageData.data;
        const offset = Math.floor(intensity);

        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                const i = (y * width + x) * 4;
                
                // Shift red channel left
                if (x + offset < width) {
                    data[i] = data[i + (offset * 4)];
                }
                
                // Shift blue channel right
                if (x - offset >= 0) {
                    data[i + 2] = data[i - (offset * 4) + 2];
                }
            }
        }

        ctx.putImageData(imageData, 0, 0);
    }

    static applyRarityGlow(ctx, width, height, rarity) {
        const colors = {
            legendary: ['#ffd700', '#ff8c00'],
            epic: ['#ff00ff', '#8b008b'],
            rare: ['#4169e1', '#0000cd'],
            common: ['#ffffff', '#808080']
        };

        const [innerColor, outerColor] = colors[rarity] || colors.common;
        
        ctx.save();
        ctx.globalCompositeOperation = 'screen';
        
        // Create radial gradient for glow
        const gradient = ctx.createRadialGradient(
            width/2, height/2, width * 0.25,
            width/2, height/2, width * 0.5
        );
        
        gradient.addColorStop(0, 'transparent');
        gradient.addColorStop(0.5, `${innerColor}33`);
        gradient.addColorStop(1, `${outerColor}00`);
        
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);
        ctx.restore();
    }

    static applyVignette(ctx, width, height, intensity) {
        const gradient = ctx.createRadialGradient(
            width/2, height/2, Math.min(width, height) * 0.3,
            width/2, height/2, Math.min(width, height) * 0.7
        );
        
        gradient.addColorStop(0, 'transparent');
        gradient.addColorStop(1, `rgba(0, 0, 0, ${intensity})`);
        
        ctx.save();
        ctx.globalCompositeOperation = 'multiply';
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);
        ctx.restore();
    }

    static addParticleSystem(ctx, width, height, type) {
        const particles = [];
        const maxParticles = 50;
        
        class Particle {
            constructor() {
                this.reset();
            }
            
            reset() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.size = Math.random() * 3 + 1;
                this.speedX = (Math.random() - 0.5) * 2;
                this.speedY = (Math.random() - 0.5) * 2;
                this.life = 1;
                this.decay = 0.01 + Math.random() * 0.01;
            }
            
            update() {
                this.x += this.speedX;
                this.y += this.speedY;
                this.life -= this.decay;
                
                if (this.life <= 0 || 
                    this.x < 0 || this.x > width || 
                    this.y < 0 || this.y > height) {
                    this.reset();
                }
            }
            
            draw(ctx) {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(255, 255, 255, ${this.life * 0.5})`;
                ctx.fill();
            }
        }

        // Initialize particle system
        for (let i = 0; i < maxParticles; i++) {
            particles.push(new Particle());
        }

        // Animation loop
        const animate = () => {
            ctx.save();
            ctx.globalCompositeOperation = 'screen';
            
            particles.forEach(particle => {
                particle.update();
                particle.draw(ctx);
            });
            
            ctx.restore();
            requestAnimationFrame(animate);
        };

        animate();
    }
}

const placeholder = PlaceholderGenerator.generatePlaceholder(512, 512, "Legendary Weapon", {
    type: 'weapons',
    rarity: 'legendary',
    animate: true
});

// Example usage
const weaponPlaceholder = await PlaceholderGenerator.createPlaceholders('weapons', {
    rarity: 'legendary',
    animate: true
});

const characterPlaceholder = await PlaceholderGenerator.createPlaceholders('characters', {
    rarity: 'epic',
    animate: true
});

const advancedPlaceholder = PlaceholderGenerator.generatePlaceholder(512, 512, "Legendary Weapon", {
    type: 'weapons',
    rarity: 'legendary',
    quality: 'high',
    animate: true
});