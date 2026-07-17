import { Injectable } from "@nestjs/common";

@Injectable()
export class RecadoUtils {
    invertString(text: string) {
        return [...text].reverse().join("");
    }
}

@Injectable()
export class RecadoUtilsMock {
    invertString(_text: string) {
        return "opa";
    }
}
