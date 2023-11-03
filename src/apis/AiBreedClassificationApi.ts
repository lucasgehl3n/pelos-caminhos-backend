import dotenv from 'dotenv';

export default class AiBreedClassificationApi {
    public static async Predict(image: Blob) {
        const formData = new FormData();
        formData.append('image', image);
        const url = process.env.AI_BREED_URL || "";
        if (url) {
            const response = await fetch(url, {
                method: 'POST',
                body: formData,
            });
            return await response.json();
        }
    }
}