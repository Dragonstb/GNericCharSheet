import { Injectable } from "@angular/core";

@Injectable({providedIn: 'root'})
export class Utils {
    private pool: string = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

    /** Gets a random sequenc of characters.
     * 
     * @param length Number of chars (floored if not an integer, one char anyways)
     * @returns A random string.
     */
    getRandomString(length: number): string {
        let symbols: string[] = [];
        for (let _ = 0; _ < Math.max(1,Math.floor(length)); _++) {
            const idx = Math.floor(Math.random()*this.pool.length);
            symbols.push(this.pool.charAt(idx));
        }
        return symbols.join('');
    }
}