import {testing} from "@/logic/lib/events.utils.ts";

export class Events {
    description: string
    statVariants: number

    constructor() {
        this.description = 'placeholder'
        this.statVariants = 10

    }

    createEvent(testing: any, rand: number) {
        let chosenVariant = testing[rand]
        this.description = chosenVariant[0]
        this.statVariants = chosenVariant[1]

    }
}