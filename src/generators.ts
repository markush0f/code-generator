import { yesNoArray } from "./const/options.Y.N";
import { IProperty } from "./types";
import { arrayIncludes, convertFirstLetterUpperCase } from "./utils/utils";
import * as readline from 'readline';

export function generateClass(className: string, properties?: IProperty[], exportClass: boolean = false): string {
    let props: string = '';
    if (properties) {
        props = properties
            .map((property) => {
                return `${property.name}${property.optional ? '?' : ''}: ${property.type}`
            }).join(';\n\t')

    }
    const initsProps = properties?.filter((property) => {
        return property.initProp;
    });

    const constructorParams = () => {
        return initsProps?.map(property => {
            return `${property.name}${property.optional ? '?' : ''}: ${property.type}`;
        }).join(', ');
    }

    const constructorBody = () => {
        return initsProps?.map(property => {
            return `this.${property.name} = ${property.name}`
        }).join(';\n\t\t');
    }
    const classNameUpper = convertFirstLetterUpperCase(className);
    return `${exportClass ? 'export ' : ''} class ${classNameUpper} {

  ${props}; 

  constructor(${properties ? constructorParams() : ''}) {
    ${properties ? constructorBody() : ''};
  }

}`
}

export function askQuestion(rl: readline.Interface, query: string): Promise<string> {
    return new Promise((resolve) => rl.question(query, (answer) => resolve(answer)));
}

export async function askPropertyOptional(rl: readline.Interface, propName: string): Promise<boolean> {
    let propOptional = '';
    while (!arrayIncludes(yesNoArray, propOptional.toLocaleLowerCase())) {
        propOptional = await askQuestion(rl, `Is the property ${propName} optional? (Y/N): `);
        if (!arrayIncludes(yesNoArray, propOptional.toLocaleLowerCase())) {
            console.log('Select a valid option please!')
        }
    }
    if (propOptional.toLocaleLowerCase() === 'n') {
        return false;
    }
    return true
}

export async function askExportClass(rl: readline.Interface) {
    let exportClass = '';
    while (!arrayIncludes(yesNoArray, exportClass.toLocaleLowerCase())) {
        exportClass = await askQuestion(rl, `Is the class export? (Y/N)`)
        if (!arrayIncludes(yesNoArray, exportClass.toLocaleLowerCase())) {
            console.log('Select a valid option please!')
        }
    }

    if (exportClass.toLocaleLowerCase() === 'n') {
        return false;
    }
    return true;

}

export async function askInitProperty(rl: readline.Interface, propName: string): Promise<boolean> {
    let initProp = '';
    while (!arrayIncludes(yesNoArray, initProp.toLocaleLowerCase())) {
        initProp = await askQuestion(rl, `Init value in constructor for ${propName} (Y/N): `);
        if (!arrayIncludes(yesNoArray, initProp.toLocaleLowerCase())) {
            console.log('Select a valid option please!')
        }
    }
    if (initProp.toLocaleLowerCase() === 'n') {
        return false;
    }
    return true;
}

function generateToStringFunction(props: [], className: string) {

    return `clasName: `
}

function generateSet(prop: IProperty) {
    return `
    set ${prop.name}(new${prop.name}) {
        this.${prop.name} =
    }
    `
}
