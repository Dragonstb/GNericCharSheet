import { Injectable } from "@angular/core";
import { ElemTypes } from "../app/elemtypes";

@Injectable({providedIn: 'root'})
export class ValidatorService {

    /** Checks if the argument could be a model.
     * 
     * @param model Something to be checked.
     * @returns True if and only if the argument is truthy and an object.
     */
    isModel(model: any): boolean {
        if(!model || typeof model !== 'object') {
            return false;
        }

        return true;
    }

    /** Tests if the model is for a component with the given id and the given type.
     * 
     * ASSUMES THAT 'model' IS PROPER. Call isModel(model) to beforehand to be sure about this.
     * 
     * @param id Id of the component the model is for.
     * @param type Element type of the component.
     * @param model The potetntial model.
     * @returns True if and only if the model contains an id and an element tyoe that matches with those of the component.
     */
    isForMe(id: string, type: ElemTypes, model: any): boolean {
        if(!this.hasNonEmptyStringProperty('id', model)) {
            return false;
        }

        if(model.id !== id) {
            return false;
        }

        if(!this.hasNonEmptyStringProperty('type', model)) {
            return false;
        }

        if(model.type !== type) {
            return false;
        }

        return true;
    }

    private hasTypedArray(name: string, type: string, model: any): boolean {
        if(!model.hasOwnProperty(name) || !model[name]){
            return false;
        }

        let arr = model[name];
        if(typeof arr !== 'object' || !Array.isArray(arr)) {
            return false;
        }

        for (const entry of arr) {
            if(typeof entry !== type) {
                return false;
            }
        }

        return true;
    }

    /** Tests if the model has a number array with the given name.
     * 
     * ASSUMES THAT 'model' IS PROPER. Call isModel(model) to beforehand to be sure about this.
     * 
     * @param name Name of the parameter that shuould be a number array.
     * @param model Object that might have a number array.
     * @returns Property with given name exists and is a number array?
     */
    hasNumberArray(name: string, model: any): boolean {
        return this.hasTypedArray(name, 'number', model);
    }

    /** Tests if the model has a string array with the given name.
     * 
     * ASSUMES THAT 'model' IS PROPER. Call isModel(model) to beforehand to be sure about this.
     * 
     * @param name Name of the parameter that should be a string array.
     * @param model Object that might have a string array.
     * @returns Property with given name exists and is a string array?
     */
    hasStringArray(name: string, model: any): boolean {
        return this.hasTypedArray(name, 'string', model);
    }

    /** Says if the object has a string property with a defined value. This might be ''.
     * 
     * @param propName Name of the property.
     * @param model The model of interest.
     * @returns Has a property of that name with a string defined in it?
     */
    hasStringProperty(propName: string, model: any): boolean {
        if(!model.hasOwnProperty(propName)) {
            return false;
        }
        
        if(typeof model[propName] !== 'string') {
            return false;
        }

        return true;
    }

    /** Determines if the model has a defined string property that is not the empty string.
     * 
     * @param propName Name of the property.
     * @param model Object in the loop.
     * @returns String prop with defined value !== ''?
     */
    hasNonEmptyStringProperty(propName: string, model: any): boolean {
        if(!this.hasStringProperty(propName, model)) {
            return false;
        }

        return model[propName] !== '';
    }

    /** Says if the object has a number property with a defined value. This number might be non-finite.
     * 
     * @param propName Name of the property.
     * @param model The model of interest.
     * @returns Has a property of that name with a number defined in it?
     */
     hasNumberProperty(propName: string, model: any): boolean {
        if(!model.hasOwnProperty(propName)) {
            return false;
        }
        
        if(typeof model[propName] !== 'number') {
            return false;
        }

        return true;
    }

    /** Says if the object has a number property with a defined value with finite value.
     * 
     * @param propName Name of the property.
     * @param model The model of interest.
     * @returns Has a property of that name with a number defined in it?
     */
     hasFiniteNumberProperty(propName: string, model: any): boolean {
        if(!this.hasNumberProperty(propName, model)) {
            return false;
        }
        
        return Number.isFinite(model[propName]);
    }

    /** Says if the object has a number property with a defined value with finite integer value.
     * 
     * @param propName Name of the property.
     * @param model The model of interest.
     * @returns Has a property of that name with an integer defined in it?
     */
     hasFiniteIntegerProperty(propName: string, model: any): boolean {
        if(!this.hasFiniteNumberProperty(propName, model)) {
            return false;
        }
        
        return Number.isInteger(model[propName]);
    }

}