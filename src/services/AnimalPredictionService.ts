import sequelize from "sequelize";
import AiBreedClassificationApi from "../apis/AiBreedClassificationApi";
import Animal from "../database/models/Animal";
import AnimalPrediction from "../database/models/AnimalPrediction";
import AnimalPredictionView from "../views/AnimalPredictionView";
import AnimalView from "../views/AnimalView";
import AnimalService from "./AnimalService";
import BaseService from "./BaseService";
import BreedService from "./BreedService";
class AnimalPredictionService extends BaseService<AnimalPrediction>{
    constructor() {
        super(AnimalPrediction);
    }

    static async getAnimalPredictionsOnSearch(image: Blob) {
        const { predictions } = await AiBreedClassificationApi.Predict(image);
        let predictionViewList = predictions as AnimalPredictionView[];
        const viewList: AnimalView[] = [];
        let listAnimals: number[] = [];
        if (predictionViewList && predictionViewList.length > 0) {
            for (let i = 0; i < predictionViewList.length; i++) {
                if(predictionViewList[i].prob < 0.2) continue;
                const breed = await BreedService.getBreedByAITag(predictionViewList[i].breed);
                if (breed && breed.id) {
                    const animals = await this.GetAnimalsByBreedPrediction(breed.id);
                    const view = new AnimalView();
                    view.breed = breed;
                    view.animalList = animals.filter(x => !listAnimals.includes(x.id));
                    listAnimals = [...listAnimals, ...view.animalList.map(x => x.id)];

                    view.rank = i + 1;
                    view.prob = predictionViewList[i].prob;
                    viewList.push(view);
                }
            }
            return viewList.filter(x => x.animalList.length > 0);
        }

        return [];
    }

    static async GetAnimalsByBreedPrediction(idBreed: number) {
        const animals = await Animal.findAll({
            include: [{
                model: AnimalPrediction,
                as: 'predictions',
                where: {
                    idBreed: idBreed
                }
            },
                'animalImages',
            ]
        });
        return animals;
    }

    static async generateAnimalPrediction(images: Blob[], idAnimal: number) {
        let listPredictions: AnimalPredictionView[] = [];

        for (let i = 0; i < images.length; i++) {
            const { predictions } = await AiBreedClassificationApi.Predict(images[i]);
            let predictionViewList = predictions as AnimalPredictionView[];
            listPredictions.push(...predictionViewList);
        }

        const groupedByBreed = listPredictions.reduce((acc: any, prediction) => ({
            ...acc,
            [prediction.breed]: [...(acc[prediction.breed] || []), prediction.prob]
        }), {});

        let finalListPredictions: AnimalPredictionView[] = [];

        for (const breed in groupedByBreed) {
            const probabilities = groupedByBreed[breed];
            const sum = probabilities.reduce((total: number, prob: string) => total + prob, 0);
            const average = sum / probabilities.length;
            const predictionView = new AnimalPredictionView();
            predictionView.breed = breed;
            predictionView.prob = average;
            finalListPredictions.push(predictionView);
        }

        finalListPredictions = finalListPredictions.sort((a: AnimalPredictionView, b: AnimalPredictionView) => b.prob - a.prob);
        const sizeSlice = finalListPredictions.length > 5 ? 5 : finalListPredictions.length;
        finalListPredictions = finalListPredictions.slice(0, sizeSlice);

        let listAnimalPredictions: AnimalPrediction[] = [];
        for (let i = 0; i < finalListPredictions.length; i++) {
            const breed = await BreedService.getBreedByAITag(finalListPredictions[i].breed);
            if (breed && breed.id) {
                const animalPrediction = new AnimalPrediction();
                animalPrediction.idAnimal = idAnimal;
                animalPrediction.idBreed = breed.id;
                animalPrediction.rank = i + 1;
                animalPrediction.percentage = finalListPredictions[i].prob;
                await this.Save(animalPrediction);
                listAnimalPredictions.push(animalPrediction);
            }
        }
        return listAnimalPredictions;
    }
}

export default AnimalPredictionService;