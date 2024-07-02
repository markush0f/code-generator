import * as fs from 'fs';
import * as readline from 'readline';

interface IProperties {
    name: string;
    type: string;
    optional?: boolean;
    initProp?: boolean;
}
function generateClass(className: string, properties?: IProperties[], exportClass: boolean = false): string {
    let props: string = '';
    if (properties) {
        props = properties
            .map((property) => {
                return `${property.name}${property.optional ? '?' : ''}: ${property.type}`
            }).join(',\n\t\t')

    }
    const constructorParams = (props: IProperties[]) => {
        const propsToConstructor = props.map((prop) => prop.initProp).join(', ')
        console.log(propsToConstructor)
        return propsToConstructor
    }
    if (properties) {
        constructorParams(properties);
    }
    return `
    export class ${className} {

        ${props},

        constructor(${properties ? constructorParams(properties) : ''}){}

    }
        `
}

console.log(generateClass('juan', [{ name: 'pedro', type: 'string', initProp: true }, { name: 'pedrito', type: 'number', optional: true }, { name: 'pedrito', type: 'number', optional: true, initProp: true }], true))