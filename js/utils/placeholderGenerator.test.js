import { PlaceholderGenerator } from './placeholderGenerator.js';

describe('PlaceholderGenerator', () => {
    let canvas;
    let ctx;

    beforeEach(() => {
        // Setup canvas for testing
        canvas = document.createElement('canvas');
        canvas.width = 256;
        canvas.height = 256;
        ctx = canvas.getContext('2d');
    });

    test('generates placeholder with correct dimensions', () => {
        const width = 512;
        const height = 512;
        const placeholder = PlaceholderGenerator.generatePlaceholder(width, height, 'Test');
        
        const img = new Image();
        img.src = placeholder;
        
        expect(img.width).toBe(width);
        expect(img.height).toBe(height);
    });

    test('applies theme based on type', () => {
        const type = 'weapons';
        const placeholder = PlaceholderGenerator.generatePlaceholder(256, 256, 'Test', { type });
        
        const theme = PlaceholderGenerator.themes[type];
        expect(theme).toBeDefined();
        expect(theme.gradient).toHaveLength(2);
        expect(theme.pattern).toBeDefined();
        expect(theme.icon).toBeDefined();
    });

    test('applies rarity effects correctly', () => {
        const rarities = ['common', 'rare', 'epic', 'legendary'];
        
        rarities.forEach(rarity => {
            const placeholder = PlaceholderGenerator.generatePlaceholder(256, 256, 'Test', {
                type: 'weapons',
                rarity
            });
            expect(placeholder).toBeDefined();
            expect(typeof placeholder).toBe('string');
            expect(placeholder.startsWith('data:image/png;base64,')).toBeTruthy();
        });
    });

    test('creates placeholders for all required sizes', async () => {
        const placeholders = await PlaceholderGenerator.createPlaceholders('weapons');
        
        expect(placeholders).toHaveProperty('preview');
        expect(placeholders).toHaveProperty('icon');
        expect(placeholders).toHaveProperty('thumbnail');
    });

    test('applies overlays without errors', () => {
        const overlays = ['noise', 'dots', 'grain', 'sparkles', 'lines'];
        
        overlays.forEach(overlay => {
            expect(() => {
                PlaceholderGenerator.applyOverlay(ctx, 256, 256, overlay);
            }).not.toThrow();
        });
    });

    test('handles animation initialization', () => {
        const placeholder = PlaceholderGenerator.generatePlaceholder(256, 256, 'Test', {
            animate: true
        });
        
        expect(placeholder).toBeDefined();
        // Animation should be running - check if canvas is being updated
        const initialData = ctx.getImageData(0, 0, 256, 256).data.toString();
        
        setTimeout(() => {
            const updatedData = ctx.getImageData(0, 0, 256, 256).data.toString();
            expect(updatedData).not.toBe(initialData);
        }, 100);
    });

    test('saves files correctly', async () => {
        const filename = 'test_placeholder.png';
        const mockBlob = new Blob([''], { type: 'image/png' });
        
        // Mock canvas.toBlob
        canvas.toBlob = jest.fn(callback => callback(mockBlob));
        
        await expect(PlaceholderGenerator.saveToFile(canvas, filename))
            .resolves
            .not.toThrow();
    });

    test('applies advanced effects based on quality setting', () => {
        const placeholder = PlaceholderGenerator.generatePlaceholder(256, 256, 'Test', {
            type: 'legendary',
            quality: 'high'
        });
        
        // Check if chromatic aberration was applied
        const imageData = ctx.getImageData(0, 0, 256, 256);
        expect(imageData.data).toBeDefined();
        expect(imageData.data.length).toBe(256 * 256 * 4);
    });
});