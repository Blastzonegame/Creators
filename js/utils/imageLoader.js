export class ImageLoader {
    static basePath = '/assets';
    static fallbacks = new Map([
        ['webp', 'png'],
        ['gif', 'png']
    ]);

    static async loadImage(path, options = {}) {
        const { fallback = true } = options;
        try {
            const img = new Image();
            const loadPromise = new Promise((resolve, reject) => {
                img.onload = () => resolve(img);
                img.onerror = async () => {
                    if (fallback) {
                        const ext = path.split('.').pop();
                        const fallbackExt = this.fallbacks.get(ext);
                        if (fallbackExt) {
                            try {
                                const fallbackImg = await this.loadImage(
                                    path.replace(ext, fallbackExt),
                                    { fallback: false }
                                );
                                resolve(fallbackImg);
                            } catch (e) {
                                reject(e);
                            }
                        } else {
                            reject(new Error(`Failed to load image: ${path}`));
                        }
                    } else {
                        reject(new Error(`Failed to load image: ${path}`));
                    }
                };
            });
            img.src = path.startsWith('/') ? path : `${this.basePath}/${path}`;
            return loadPromise;
        } catch (error) {
            console.error(`Error loading image ${path}:`, error);
            throw error;
        }
    }
}