import Animal from "../database/models/Animal";
import Breed from "../database/models/Breed";

export default class AnimalView{
    public animalList: Animal[] = [];
    public breed!: Breed;
    public rank!: number;
    public prob!: number;
}